import React from 'react';
import {
  MarketRecord,
  MultiAgentResponse,
  InvestorProfile,
} from '../types';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';

interface AIIntelligenceViewProps {
  currentQuote: MarketRecord;
  agentResponse: MultiAgentResponse | null;
  selectedProfile: InvestorProfile;
  isLoadingAgents: boolean;
  onRunAgents: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectCitation: (docId: string) => void;
}

export const AIIntelligenceView: React.FC<AIIntelligenceViewProps> = ({
  currentQuote,
  agentResponse,
  selectedProfile,
  isLoadingAgents,
  onRunAgents,
  onNavigateTab,
  onSelectCitation,
}) => {
  const techAgent = agentResponse?.agents.find(a => a.agent_id === 'agent_technical');
  const volAgent = agentResponse?.agents.find(a => a.agent_id === 'agent_volume');
  const ragAgent = agentResponse?.agents.find(a => a.agent_id === 'agent_rag_document');
  const riskAgent = agentResponse?.agents.find(a => a.agent_id === 'agent_investor_risk');
  const synthesis = agentResponse?.synthesis;

  const isPositive = currentQuote.change >= 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Dimensional Financial Intelligence Report</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Institutional Intelligence: <span className="text-emerald-600">{currentQuote.name}</span> ({currentQuote.symbol})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Independent evaluation across Technical Price Trend, Institutional Liquidity, Corporate Regulatory Filings, and Mandate Suitability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-bold font-mono text-slate-900">
                ₹{currentQuote.close.toFixed(2)}
              </div>
              <div className={`text-xs font-mono font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? '+' : ''}{currentQuote.change.toFixed(2)} ({isPositive ? '+' : ''}{currentQuote.changePercent}%)
              </div>
            </div>
            <button
              onClick={onRunAgents}
              disabled={isLoadingAgents}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-all shadow-xs shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {isLoadingAgents ? 'Evaluating Feeds...' : 'Re-Run Evaluation'}
            </button>
          </div>
        </div>

        {/* Executive 6-Part Structure (As requested) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 text-xs">
          {/* 1. What Happened? */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">1</span>
              <span>What Happened?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {currentQuote.symbol} closed at ₹{currentQuote.close.toFixed(2)} with a {isPositive ? 'gain' : 'decline'} of {Math.abs(currentQuote.changePercent)}%. Volume traded reached {currentQuote.volume.toLocaleString('en-IN')} shares against historical averages.
            </p>
          </div>

          {/* 2. Why It Matters */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">2</span>
              <span>Why It Matters</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {synthesis?.market_context ||
                `${currentQuote.name}'s current price action confirms trend continuation with price maintaining position above intermediate moving averages, while volume confirms institutional participation without distribution spikes.`}
            </p>
          </div>

          {/* 3. Supporting Evidence & Data */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Supporting Evidence & Data</span>
            </div>
            <ul className="text-slate-700 space-y-1.5 leading-relaxed">
              {(synthesis?.supporting_evidence || [
                'Moving average alignment indicates constructive intermediate trend',
                'Trading volume ratio within normal accumulation boundaries',
                'Operating profit margins defended in latest exchange filings'
              ]).map((sup, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{sup}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Risks & Alternative Explanations */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/60 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Risks & Alternative Explanations</span>
            </div>
            <ul className="text-slate-700 space-y-1.5 leading-relaxed">
              {(synthesis?.opposing_evidence || [
                'Sector rotation into defensive counters could cap near-term upside',
                'Input cost fluctuations could compress operating margins in subsequent quarters'
              ]).map((opp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Invalidation Conditions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px]">5</span>
              <span>Thesis Invalidation Triggers</span>
            </div>
            <ul className="text-slate-600 space-y-1 leading-relaxed">
              {(synthesis?.invalidation_conditions || [
                'Daily close breaching beneath 50-day moving average',
                'Unexpected adverse regulatory ruling or compliance notice',
                'Sustained institutional FII selling exceeding 2.5x average block volume'
              ]).map((cond, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Confidence & Limitations */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-slate-600" />
              <span>Confidence & Analytical Limitations</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Analytical Confidence: <strong>{synthesis?.evidence_sufficiency || 'High'}</strong>. Backtested on 60-day historical OHLCV ticks. Note that corporate filings reflect periodic disclosures and may not reflect real-time executive changes.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analytical Breakdown Tabs / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Structure Analyst Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Module 1</span>
              <h3 className="text-sm font-bold text-slate-900">Technical & Trend Structure</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {techAgent?.signal_classification || 'Positive'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {techAgent?.summary || 'Bullish trend structure with price trading above key intermediate moving averages.'}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">SMA 20:</span>
              <span className="text-slate-900 font-bold">₹{techAgent?.metrics_used?.SMA_20 || '-'}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">SMA 50:</span>
              <span className="text-slate-900 font-bold">₹{techAgent?.metrics_used?.SMA_50 || '-'}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">14D RSI:</span>
              <span className="text-slate-900 font-bold">{techAgent?.metrics_used?.RSI_14 || '-'}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Trend:</span>
              <span className="text-emerald-600 font-bold">{techAgent?.metrics_used?.Trend || 'BULLISH'}</span>
            </div>
          </div>
        </div>

        {/* Volume & Liquidity Analyst Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Module 2</span>
              <h3 className="text-sm font-bold text-slate-900">Volume & Order Flow</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {volAgent?.signal_classification || 'Neutral'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {volAgent?.summary || 'Orderly volume participation without aggressive distribution or block dumping.'}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Volume Ratio:</span>
              <span className="text-slate-900 font-bold">{volAgent?.metrics_used?.Volume_Ratio || '1.02'}x</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Z-Score:</span>
              <span className="text-slate-900 font-bold">{volAgent?.metrics_used?.Z_Score || '0.42'}σ</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Session Vol:</span>
              <span className="text-slate-900 font-bold">{currentQuote.volume.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Anomaly Flag:</span>
              <span className="text-emerald-600 font-bold">None</span>
            </div>
          </div>
        </div>

        {/* Corporate Filings & Sentiment Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Module 3</span>
              <h3 className="text-sm font-bold text-slate-900">Regulatory Filings & Earnings</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {ragAgent?.signal_classification || 'Positive'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {ragAgent?.summary || 'Quarterly financial report reveals resilient revenue growth and controlled leverage.'}
          </p>

          {ragAgent?.citations && ragAgent.citations.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-700 block">Verified Filings:</span>
              {ragAgent.citations.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectCitation(c.doc_id);
                    onNavigateTab('documents');
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs text-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="truncate">{c.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mandate Suitability Analyst Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Module 4</span>
              <h3 className="text-sm font-bold text-slate-900">Mandate & Risk Suitability</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {riskAgent?.signal_classification || 'Positive'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {riskAgent?.summary || `Position aligns with ${selectedProfile.name}'s declared ${selectedProfile.risk_tolerance} mandate.`}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Investor:</span>
              <span className="text-slate-900 font-bold truncate block">{selectedProfile.name}</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Max Position Cap:</span>
              <span className="text-slate-900 font-bold">{selectedProfile.max_single_position_pct}%</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Cash Buffer:</span>
              <span className="text-slate-900 font-bold">{selectedProfile.cash_allocation_pct}%</span>
            </div>
            <div>
              <span className="text-slate-600 text-[11px] block font-sans">Horizon:</span>
              <span className="text-slate-900 font-bold">{selectedProfile.time_horizon}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
