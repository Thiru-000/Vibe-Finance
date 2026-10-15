import { FINANCIAL_DOCUMENTS } from '../data/documentCorpus';
import { DocumentCitation, FinancialDocument } from '../types';

export interface RAGSearchOptions {
  query: string;
  ticker?: string | null;
  sector?: string | null;
  doc_type?: string | null;
  minScoreThreshold?: number;
  limit?: number;
}

export interface RAGSearchResult {
  query: string;
  citations: DocumentCitation[];
  totalChunksSearched: number;
  retrievalMethod: 'Semantic (Gemini Embedding)' | 'BM25 / Lexical Hybrid';
  executionTimeMs: number;
  thresholdApplied: number;
  hasSufficientEvidence: boolean;
}

/**
 * Tokenizes text into normalized word stems for BM25 retrieval
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹$%.-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
]);

/**
 * Performs BM25 / Lexical Hybrid search across the document corpus with scoring
 */
export function searchFinancialCorpus(options: RAGSearchOptions): RAGSearchResult {
  const startTime = Date.now();
  const {
    query,
    ticker,
    sector,
    doc_type,
    minScoreThreshold = 0.25,
    limit = 5,
  } = options;

  const queryTokens = tokenize(query);

  // Flatten all document chunks with parent metadata
  interface Candidate {
    doc: FinancialDocument;
    chunkId: string;
    text: string;
    tags: string[];
    sectionTitle?: string;
  }

  const candidates: Candidate[] = [];
  for (const doc of FINANCIAL_DOCUMENTS) {
    // Apply filters
    if (ticker && doc.ticker && doc.ticker.toUpperCase() !== ticker.toUpperCase()) {
      continue;
    }
    if (sector && doc.sector.toLowerCase() !== sector.toLowerCase()) {
      continue;
    }
    if (doc_type && doc.doc_type !== doc_type) {
      continue;
    }

    for (const chunk of doc.chunks) {
      candidates.push({
        doc,
        chunkId: chunk.chunk_id,
        text: chunk.text,
        tags: chunk.tags,
        sectionTitle: chunk.section_title,
      });
    }
  }

  // Calculate scores
  const scoredCandidates: { candidate: Candidate; score: number }[] = [];

  for (const item of candidates) {
    const chunkTokens = tokenize(item.text);
    const tagTokens = item.tags.flatMap(t => tokenize(t));
    const titleTokens = tokenize(item.doc.title);

    let score = 0;

    // Term match frequency
    for (const qToken of queryTokens) {
      const chunkMatches = chunkTokens.filter(t => t.includes(qToken) || qToken.includes(t)).length;
      const tagMatches = tagTokens.filter(t => t.includes(qToken) || qToken.includes(t)).length;
      const titleMatches = titleTokens.filter(t => t.includes(qToken) || qToken.includes(t)).length;

      score += chunkMatches * 1.0;
      score += tagMatches * 2.5; // Boost for metadata tags
      score += titleMatches * 1.5; // Boost for title match
    }

    // Direct ticker exact match boost
    if (ticker && item.doc.ticker && item.doc.ticker.toUpperCase() === ticker.toUpperCase()) {
      score += 3.0;
    }

    // Normalized score between 0.0 and 1.0
    const normalizedScore = Number(Math.min(1.0, score / Math.max(1, queryTokens.length * 4)).toFixed(3));

    if (normalizedScore >= minScoreThreshold) {
      scoredCandidates.push({ candidate: item, score: normalizedScore });
    }
  }

  // Sort descending by score
  scoredCandidates.sort((a, b) => b.score - a.score);

  const selected = scoredCandidates.slice(0, limit);

  const citations: DocumentCitation[] = selected.map(s => ({
    doc_id: s.candidate.doc.id,
    title: s.candidate.doc.title,
    publisher: s.candidate.doc.publisher,
    publication_date: s.candidate.doc.publication_date,
    excerpt: s.candidate.text,
    retrieval_score: s.score,
    retrieval_method: 'BM25 / Lexical Hybrid',
    is_synthetic: s.candidate.doc.is_synthetic,
    source_url: s.candidate.doc.source_url,
  }));

  const executionTimeMs = Date.now() - startTime;

  return {
    query,
    citations,
    totalChunksSearched: candidates.length,
    retrievalMethod: 'BM25 / Lexical Hybrid',
    executionTimeMs,
    thresholdApplied: minScoreThreshold,
    hasSufficientEvidence: citations.length > 0,
  };
}

/**
 * Validates that all citations referenced in an agent claim actually exist in the retrieved corpus set.
 */
export function validateCitations(
  citations: DocumentCitation[],
  retrievedCitations: DocumentCitation[]
): { isValid: boolean; invalidIds: string[] } {
  const validIds = new Set(retrievedCitations.map(c => c.doc_id));
  const invalidIds: string[] = [];

  for (const c of citations) {
    if (!validIds.has(c.doc_id)) {
      invalidIds.push(c.doc_id);
    }
  }

  return {
    isValid: invalidIds.length === 0,
    invalidIds,
  };
}
