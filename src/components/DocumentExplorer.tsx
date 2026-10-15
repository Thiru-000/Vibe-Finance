import React, { useState, useMemo } from 'react';
import { FINANCIAL_DOCUMENTS } from '../data/documentCorpus';
import { FinancialDocument, DocumentCitation } from '../types';
import { searchFinancialCorpus } from '../utils/ragEngine';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  X,
} from 'lucide-react';

interface DocumentExplorerProps {
  initialSelectedDocId?: string | null;
}

export const DocumentExplorer: React.FC<DocumentExplorerProps> = ({
  initialSelectedDocId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedDocType, setSelectedDocType] = useState<string>('ALL');
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.20);
  const [activeDocModal, setActiveDocModal] = useState<FinancialDocument | null>(() => {
    if (initialSelectedDocId) {
      return FINANCIAL_DOCUMENTS.find(d => d.id === initialSelectedDocId) || null;
    }
    return null;
  });

  // Extract unique sectors and doc types for filter menus
  const allSectors = useMemo(() => {
    const s = new Set<string>();
    FINANCIAL_DOCUMENTS.forEach(d => s.add(d.sector));
    return ['ALL', ...Array.from(s)];
  }, []);

  const allDocTypes = useMemo(() => {
    const s = new Set<string>();
    FINANCIAL_DOCUMENTS.forEach(d => s.add(d.doc_type));
    return ['ALL', ...Array.from(s)];
  }, []);

  const allTickers = useMemo(() => {
    const s = new Set<string>();
    FINANCIAL_DOCUMENTS.forEach(d => {
      if (d.ticker) s.add(d.ticker);
    });
    return ['ALL', ...Array.from(s)];
  }, []);

  // Run RAG Search or Filter View
  const ragResults = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return searchFinancialCorpus({
        query: searchQuery,
        ticker: selectedTicker === 'ALL' ? null : selectedTicker,
        sector: selectedSector === 'ALL' ? null : selectedSector,
        doc_type: selectedDocType === 'ALL' ? null : selectedDocType,
        minScoreThreshold: similarityThreshold,
        limit: 15,
      });
    }
    return null;
  }, [searchQuery, selectedTicker, selectedSector, selectedDocType, similarityThreshold]);

  // Filtered documents when no search query
  const filteredDocs = useMemo(() => {
    return FINANCIAL_DOCUMENTS.filter(doc => {
      if (selectedTicker !== 'ALL' && doc.ticker !== selectedTicker) return false;
      if (selectedSector !== 'ALL' && doc.sector !== selectedSector) return false;
      if (selectedDocType !== 'ALL' && doc.doc_type !== selectedDocType) return false;
      return true;
    });
  }, [selectedTicker, selectedSector, selectedDocType]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stock Research & Regulatory Filings Repository</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Corporate Disclosures & Filings Research
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search authenticated BSE/NSE disclosures, quarterly earnings releases, SEBI regulatory circulars, and RBI monetary policy statements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-700">
              Disclosures Indexed: <span className="text-emerald-600 font-bold">{FINANCIAL_DOCUMENTS.length}</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Threshold Slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search filings by keyword (e.g., 'EBITDA margin capex', 'tariff hike ARPU', 'FII outflows')..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Relevance Threshold:</span>
            <div className="flex items-center gap-2 font-mono">
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={similarityThreshold}
                onChange={e => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-24 accent-emerald-500 cursor-pointer"
              />
              <span className="text-emerald-600 font-bold text-xs">{similarityThreshold.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Ticker Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-slate-500 text-[11px]">Ticker:</span>
            <select
              value={selectedTicker}
              onChange={e => setSelectedTicker(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              {allTickers.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-slate-500 text-[11px]">Sector:</span>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {allSectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Doc Type Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-slate-500 text-[11px]">Type:</span>
            <select
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value)}
              className="bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
            >
              {allDocTypes.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(selectedTicker !== 'ALL' || selectedSector !== 'ALL' || selectedDocType !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTicker('ALL');
                setSelectedSector('ALL');
                setSelectedDocType('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {ragResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Found <strong>{ragResults.citations.length}</strong> matching excerpts for "{searchQuery}"
            </span>
            <span className="font-mono text-[11px]">
              Query Latency: {ragResults.executionTimeMs}ms
            </span>
          </div>

          <div className="space-y-3">
            {ragResults.citations.map((citation: DocumentCitation, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {citation.doc_id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{citation.title}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Score: <strong>{citation.retrieval_score.toFixed(2)}</strong> · {citation.publication_date}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                  "{citation.excerpt}"
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>Source: {citation.publisher}</span>
                  <button
                    onClick={() => {
                      const doc = FINANCIAL_DOCUMENTS.find(d => d.id === citation.doc_id);
                      if (doc) setActiveDocModal(doc);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    View Full Filing Document →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    {doc.ticker || 'MARKET'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {doc.doc_type} · {doc.publication_date}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                  {doc.publisher}
                </span>
                <button
                  onClick={() => setActiveDocModal(doc)}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer shrink-0"
                >
                  <span>Read Filing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Reader Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-semibold">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{activeDocModal.id} · {activeDocModal.doc_type}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {activeDocModal.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Publisher: {activeDocModal.publisher} · Date: {activeDocModal.publication_date}
                </div>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed scrollbar-thin">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-900 mb-1">Executive Summary:</div>
                <p>{activeDocModal.summary}</p>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-2">Authenticated Filing Body:</div>
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/60 leading-relaxed whitespace-pre-line font-sans text-xs">
                  {activeDocModal.content}
                </div>
              </div>

              {activeDocModal.chunks && activeDocModal.chunks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900">Key Section Chunks:</div>
                  <div className="space-y-2">
                    {activeDocModal.chunks.map(ch => (
                      <div key={ch.chunk_id} className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100">
                        <div className="font-semibold text-emerald-800 text-[11px] mb-1">
                          {ch.section_title}
                        </div>
                        <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                          {ch.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                SEBI/Exchange Registry Verified
              </span>
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
