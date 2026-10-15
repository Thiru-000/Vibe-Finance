export type Exchange = 'NSE' | 'BSE';

export type DataQualityStatus =
  | 'VALID'
  | 'STALE'
  | 'ANOMALY'
  | 'MISSING_BARS'
  | 'INSUFFICIENT_HISTORY';

export interface MarketRecord {
  symbol: string;
  name: string;
  exchange: Exchange;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  prevClose: number;
  change: number;
  changePercent: number;
  vwap: number;
  currency: string;
  source: string;
  is_synthetic: boolean;
  data_quality_status: DataQualityStatus;
  quality_notes?: string[];
}

export interface OHLCVPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  rsi?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface TechnicalIndicators {
  symbol: string;
  sma20: number;
  sma50: number;
  rsi14: number;
  volatility20d: number; // Annualized standard deviation of returns
  return1d: number;
  return5d: number;
  return20d: number;
  high52w: number;
  low52w: number;
  trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  isBreakout: boolean;
  breakoutType: 'UPWARD_BREAKOUT' | 'DOWNWARD_BREAKDOWN' | 'NONE';
  dataQuality: DataQualityStatus;
}

export interface VolumeMetrics {
  symbol: string;
  currentVolume: number;
  baselineVolume20d: number;
  volumeRatio: number; // currentVolume / baselineVolume20d
  zScore: number;
  isAnomaly: boolean;
  divergenceDetected: boolean;
  divergenceType: 'BULLISH_DIVERGENCE' | 'BEARISH_DIVERGENCE' | 'CONFIRMING' | 'NEUTRAL';
  outlierStatus: boolean;
}

export type SignalLabel = 'Positive' | 'Neutral' | 'Negative' | 'Insufficient Data';

export interface SignalDimension {
  id: string;
  dimensionName: string;
  label: SignalLabel;
  score: number; // -1.0 to +1.0
  heuristicConfidence: number; // 0 - 100%
  calibratedConfidence: number; // 0 - 100% (empirically derived)
  basis: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  sourceProvenance: string;
  timeWindow: string;
  dataQualityWarning?: string;
}

export interface DocumentChunk {
  chunk_id: string;
  doc_id: string;
  text: string;
  tags: string[];
  section_title?: string;
}

export interface FinancialDocument {
  id: string;
  title: string;
  publisher: string;
  publication_date: string;
  ticker: string | null;
  sector: string;
  doc_type:
    | 'Earnings'
    | 'Exchange Disclosure'
    | 'Corporate announcements'
    | 'Regulatory'
    | 'Macro'
    | 'FII_DII_Flow'
    | 'Sector Report';
  is_synthetic: boolean;
  source_url?: string;
  summary: string;
  content: string;
  chunks: DocumentChunk[];
}

export interface DocumentCitation {
  doc_id: string;
  title: string;
  publisher: string;
  publication_date: string;
  excerpt: string;
  retrieval_score: number;
  retrieval_method: 'Semantic (Gemini Embedding)' | 'BM25 / Lexical Hybrid';
  is_synthetic: boolean;
  source_url?: string;
}

export type AgentStatus = 'running' | 'completed' | 'degraded' | 'failed';

export interface AgentOutput {
  agent_id: 'agent_technical' | 'agent_volume' | 'agent_rag_document' | 'agent_investor_risk';
  agent_name: string;
  status: AgentStatus;
  summary: string;
  signal_classification: 'Positive' | 'Neutral' | 'Negative' | 'Insufficient Data';
  signal_score: number; // -1.0 to 1.0
  confidence: number; // 0 to 100
  heuristic_confidence: number;
  calibrated_confidence: number;
  confidence_explanation: string;
  supporting_evidence: string[];
  contradicting_evidence: string[];
  metrics_used: Record<string, string | number>;
  data_sources: string[];
  data_quality: string;
  limitations: string[];
  execution_time_ms: number;
  citations?: DocumentCitation[];
  suitability_assessment?: {
    alignment_score: number; // 0 to 100
    risk_warnings: string[];
    concentration_impact: string;
    time_horizon_fit: string;
    behavioral_caveats: string[];
  };
}

export interface SynthesisOutput {
  overall_interpretation:
    | 'Bullish Bias'
    | 'Bearish Caution'
    | 'Neutral Consolidation'
    | 'Conflicting Signals'
    | 'Insufficient Evidence';
  market_context: string;
  technical_evidence: string;
  volume_evidence: string;
  retrieved_document_evidence: string;
  portfolio_implications: string;
  investor_profile_relevance: string;
  confidence_assessment: {
    score: number;
    confidence_type: 'Heuristic' | 'Calibrated';
    basis: string;
  };
  supporting_evidence: string[];
  opposing_evidence: string[];
  unresolved_disagreements: string[];
  missing_information: string[];
  invalidation_conditions: string[];
  suggested_research_actions: string[];
  source_citations: DocumentCitation[];
  evidence_sufficiency: 'Sufficient' | 'Marginal' | 'Insufficient';
  execution_time_total_ms: number;
}

export interface MultiAgentResponse {
  symbol: string;
  timestamp: string;
  investor_profile_id: string;
  agents: AgentOutput[];
  synthesis: SynthesisOutput;
  market_snapshot: MarketRecord;
  execution_metadata: {
    parallel_execution: boolean;
    gemini_model_used: string;
    server_time: string;
    deterministic_fallback_active: boolean;
  };
}

export interface HoldingItem {
  symbol: string;
  company_name: string;
  sector: string;
  quantity: number;
  avg_price: number;
  current_price: number;
}

export interface InvestorProfile {
  id: string;
  name: string;
  alias: string;
  avatar_bg?: string;
  risk_tolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  time_horizon: 'Short-Term (< 6M)' | 'Medium-Term (6M-3Y)' | 'Long-Term (3Y+)';
  cash_allocation_pct: number;
  max_single_position_pct: number;
  holdings: HoldingItem[];
  watchlist: string[];
  sector_exposure: Record<string, number>;
  investment_objectives: string[];
  behavioral_notes: string;
}

export interface BacktestMetric {
  horizon: '1D' | '5D' | '20D';
  signal_dimension: string;
  samples: number;
  directional_accuracy_pct: number;
  mean_return_pct: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  brier_score: number; // Calibration accuracy (0 = perfect calibration)
}
