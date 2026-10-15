import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GoogleGenAI } from '@google/genai';
import {
  fetchLiveMarketQuote,
  fetchLiveHistoricalData,
  fetchLiveIndices,
  SUPPORTED_SECURITIES,
} from './src/utils/liveMarketService';
import { searchFinancialCorpus } from './src/utils/ragEngine';
import { runMultiAgentPipeline } from './src/utils/agentOrchestrator';
import { DEFAULT_INVESTOR_PROFILES } from './src/data/investorProfiles';
import { FINANCIAL_DOCUMENTS } from './src/data/documentCorpus';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
let geminiRateLimitCooldownUntil = 0;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gemini_api_configured: !!process.env.GEMINI_API_KEY,
    gemini_model: 'gemini-3.8-flash',
    pipeline_mode: 'Real-Time Live Market Ingestion + Institutional Research Synthesis',
    market_provider: 'National Stock Exchange of India (Live Exchange Tick API)',
    rag_corpus_size: FINANCIAL_DOCUMENTS.length,
    active_symbols: Object.keys(SUPPORTED_SECURITIES),
  });
});

/**
 * Get real-time live market quote and calculated indicators
 */
app.get('/api/market/quote/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const quote = await fetchLiveMarketQuote(symbol);
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch live quote' });
  }
});

/**
 * Get real-world historical OHLCV series
 */
app.get('/api/market/history/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const range = (req.query.range as string) || '3mo';
    const history = await fetchLiveHistoricalData(symbol, range);
    res.json({ symbol, count: history.length, history });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch historical series' });
  }
});

/**
 * Get live benchmark indices (NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT)
 */
app.get('/api/market/indices', async (req, res) => {
  try {
    const indices = await fetchLiveIndices();
    res.json(indices);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch indices' });
  }
});

/**
 * Get all financial research documents & filings
 */
app.get('/api/documents', (req, res) => {
  res.json(FINANCIAL_DOCUMENTS);
});

/**
 * RAG search query
 */
app.post('/api/rag/search', (req, res) => {
  const { query, ticker, sector, doc_type, minScoreThreshold, limit } = req.body;
  const result = searchFinancialCorpus({
    query: query || '',
    ticker: ticker || null,
    sector: sector || null,
    doc_type: doc_type || null,
    minScoreThreshold: minScoreThreshold !== undefined ? minScoreThreshold : 0.2,
    limit: limit || 6,
  });
  res.json(result);
});

/**
 * Run Institutional Multi-Agent Analysis Pipeline on Live Market Data
 */
app.post('/api/agents/run', async (req, res) => {
  try {
    const { symbol = 'RELIANCE', investorProfileId = 'profile_balanced', customQuery } = req.body;
    const cleanSymbol = symbol.toUpperCase();

    // Fetch real live quote and real historical series
    const [snapshot, history] = await Promise.all([
      fetchLiveMarketQuote(cleanSymbol),
      fetchLiveHistoricalData(cleanSymbol, '3mo'),
    ]);

    // Find profile
    const profile =
      DEFAULT_INVESTOR_PROFILES.find(p => p.id === investorProfileId) ||
      DEFAULT_INVESTOR_PROFILES[1];

    // Run parallel analytical engine
    const pipelineResponse = await runMultiAgentPipeline(snapshot, history, profile, customQuery);

    // If Gemini client is active and not currently rate-limited, enhance with institutional research synthesis
    if (geminiClient && Date.now() > geminiRateLimitCooldownUntil) {
      try {
        const prompt = `You are the Lead Equity Strategist at VibeFinance, an institutional financial intelligence firm covering Indian equities.
Review the following verified technical, volume, and regulatory findings for ${snapshot.symbol} (${snapshot.name}, currently trading at ₹${snapshot.close}, ${snapshot.changePercent}% on the day).

TECHNICAL INTELLIGENCE:
Summary: ${pipelineResponse.agents[0].summary}
Signal: ${pipelineResponse.agents[0].signal_classification} (Score: ${pipelineResponse.agents[0].signal_score})
Supporting: ${pipelineResponse.agents[0].supporting_evidence.join('; ')}
Risks: ${pipelineResponse.agents[0].contradicting_evidence.join('; ')}

VOLUME & LIQUIDITY FLOW:
Summary: ${pipelineResponse.agents[1].summary}
Signal: ${pipelineResponse.agents[1].signal_classification}
Metrics: ${JSON.stringify(pipelineResponse.agents[1].metrics_used)}
Observations: ${pipelineResponse.agents[1].supporting_evidence.join('; ')}

REGULATORY & CORPORATE DISCLOSURES:
Summary: ${pipelineResponse.agents[2].summary}
Disclosures: ${pipelineResponse.agents[2].supporting_evidence.join('; ')}
Risk Factors: ${pipelineResponse.agents[2].contradicting_evidence.join('; ')}

INVESTOR SUITABILITY CONTEXT:
Investor: ${profile.name} (Mandate: ${profile.risk_tolerance}, Horizon: ${profile.time_horizon})
Suitability: ${pipelineResponse.agents[3].summary}

Write a concise, professional equity research brief. Do NOT use AI clichés, do NOT mention "AI agents", "prompts", or "workers". Write with natural, authoritative financial acumen suitable for professional investors.
Return strictly valid JSON:
{
  "overall_interpretation": "Bullish Bias" | "Bearish Caution" | "Neutral Consolidation" | "Conflicting Signals" | "Insufficient Evidence",
  "synthesis_narrative": "A clean 2-3 sentence executive market brief summarizing price action, volume participation, and fundamental catalyst.",
  "unresolved_disagreements": ["2-3 concrete tensions between technical price action and disclosures"],
  "invalidation_conditions": ["3 specific testable market conditions that would invalidate this thesis"],
  "suggested_research_actions": ["3 concrete research steps for the portfolio manager"]
}`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000)
        );

        const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
        let geminiRes: any = null;

        for (const candidateModel of candidateModels) {
          try {
            geminiRes = await Promise.race([
              geminiClient.models.generateContent({
                model: candidateModel,
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                },
              }),
              timeoutPromise,
            ]);
            if (geminiRes && geminiRes.text) {
              pipelineResponse.execution_metadata.gemini_model_used = candidateModel;
              break;
            }
          } catch (modelErr: any) {
            const errStr = String(modelErr?.message || modelErr);
            if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED')) {
              geminiRateLimitCooldownUntil = Date.now() + 15 * 60 * 1000;
              break;
            }
          }
        }

        if (geminiRes && geminiRes.text) {
          try {
            const parsed = JSON.parse(geminiRes.text);
            if (parsed.overall_interpretation) {
              pipelineResponse.synthesis.overall_interpretation = parsed.overall_interpretation;
            }
            if (parsed.synthesis_narrative) {
              pipelineResponse.synthesis.market_context = parsed.synthesis_narrative;
            }
            if (Array.isArray(parsed.unresolved_disagreements) && parsed.unresolved_disagreements.length > 0) {
              pipelineResponse.synthesis.unresolved_disagreements = parsed.unresolved_disagreements;
            }
            if (Array.isArray(parsed.invalidation_conditions) && parsed.invalidation_conditions.length > 0) {
              pipelineResponse.synthesis.invalidation_conditions = parsed.invalidation_conditions;
            }
            if (Array.isArray(parsed.suggested_research_actions) && parsed.suggested_research_actions.length > 0) {
              pipelineResponse.synthesis.suggested_research_actions = parsed.suggested_research_actions;
            }
          } catch {
            // Keep deterministic synthesis on parse issues
          }
        }
      } catch {
        geminiRateLimitCooldownUntil = Date.now() + 15 * 60 * 1000;
      }
    }

    res.json(pipelineResponse);
  } catch (error: any) {
    console.error('Error in /api/agents/run:', error);
    res.status(500).json({ error: error.message || 'Internal server error running analysis' });
  }
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VibeFinance Live Terminal listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
