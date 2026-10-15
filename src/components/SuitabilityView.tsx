import React, { useState, useEffect } from 'react';
import { InvestorProfile, MarketRecord, AgentOutput } from '../types';
import { runInvestorRiskAgent } from '../utils/agentOrchestrator';
import { computePortfolioMetrics } from '../data/investorProfiles';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SuitabilityViewProps {
  currentQuote: MarketRecord;
  profiles: InvestorProfile[];
  selectedProfile: InvestorProfile;
  onSelectProfile: (profile: InvestorProfile) => void;
  livePriceMap?: Record<string, number>;
}

export const SuitabilityView: React.FC<SuitabilityViewProps> = ({
  currentQuote,
  profiles,
  selectedProfile,
  onSelectProfile,
  livePriceMap,
}) => {
  const [profileAId, setProfileAId] = useState<string>(profiles[0]?.id || 'profile_conservative');
  const [profileBId, setProfileBId] = useState<string>(profiles[2]?.id || 'profile_growth');
  const [analysisA, setAnalysisA] = useState<AgentOutput | null>(null);
  const [analysisB, setAnalysisB] = useState<AgentOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const profileA = profiles.find(p => p.id === profileAId) || profiles[0];
  const profileB = profiles.find(p => p.id === profileBId) || profiles[1];

  useEffect(() => {
    const runComparison = async () => {
      setIsCalculating(true);
      const [resA, resB] = await Promise.all([
        runInvestorRiskAgent(currentQuote, profileA),
        runInvestorRiskAgent(currentQuote, profileB),
      ]);
      setAnalysisA(resA);
      setAnalysisB(resB);
      setIsCalculating(false);
    };

    runComparison();
  }, [profileAId, profileBId, currentQuote]);

  const metricsA = computePortfolioMetrics(profileA, livePriceMap);
  const metricsB = computePortfolioMetrics(profileB, livePriceMap);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mandate Alerts & Portfolio Suitability</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Investor Risk Screening: <span className="text-emerald-600">{currentQuote.symbol}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identical live market price (₹{currentQuote.close}, {currentQuote.changePercent}%) screened against distinct portfolio constraints, liquidity buffers, and concentration ceilings.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-mono">LTP:</span>
            <span className="text-slate-900 font-bold font-mono">₹{currentQuote.close.toFixed(2)}</span>
          </div>
        </div>

        {/* Executive Takeaway */}
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200/70 rounded-xl text-xs leading-relaxed text-slate-700">
          <div className="font-bold text-slate-900 mb-1">Portfolio Risk Principle:</div>
          <p>
            An equity setup that is highly constructive for a growth mandate can simultaneously violate single-position concentration caps or downside volatility limits for a conservative wealth preserver. VibeFinance contextualizes market intelligence against verified client mandates.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mandate A */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Mandate 1</span>
              <select
                value={profileAId}
                onChange={e => setProfileAId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-2.5 py-1.5 mt-1 focus:outline-none cursor-pointer"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.risk_tolerance})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {profileA.risk_tolerance}
            </span>
          </div>

          {/* Profile Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-500 block font-sans">Horizon:</span>
              <span className="text-slate-900 font-semibold">{profileA.time_horizon}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Max Position Cap:</span>
              <span className="text-slate-900 font-semibold">{profileA.max_single_position_pct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Cash Reserve:</span>
              <span className="text-slate-900 font-semibold">{profileA.cash_allocation_pct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Portfolio Value:</span>
              <span className="text-slate-900 font-semibold">₹{metricsA.totalPortfolioValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Analysis */}
          {isCalculating ? (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              Calculating suitability against portfolio constraints...
            </div>
          ) : analysisA ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-700">Suitability Assessment:</span>
                <span className="text-sm font-bold font-mono text-emerald-700">
                  {analysisA.metrics_used?.Suitability_Score || 75} / 100
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 block">Mandate Observations:</span>
                {analysisA.supporting_evidence.map((sup, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sup}</span>
                  </div>
                ))}
                {analysisA.contradicting_evidence.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Mandate B */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Mandate 2</span>
              <select
                value={profileBId}
                onChange={e => setProfileBId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-2.5 py-1.5 mt-1 focus:outline-none cursor-pointer"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.risk_tolerance})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              {profileB.risk_tolerance}
            </span>
          </div>

          {/* Profile Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-500 block font-sans">Horizon:</span>
              <span className="text-slate-900 font-semibold">{profileB.time_horizon}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Max Position Cap:</span>
              <span className="text-slate-900 font-semibold">{profileB.max_single_position_pct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Cash Reserve:</span>
              <span className="text-slate-900 font-semibold">{profileB.cash_allocation_pct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans">Portfolio Value:</span>
              <span className="text-slate-900 font-semibold">₹{metricsB.totalPortfolioValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Analysis */}
          {isCalculating ? (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              Calculating suitability against portfolio constraints...
            </div>
          ) : analysisB ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-700">Suitability Assessment:</span>
                <span className="text-sm font-bold font-mono text-amber-700">
                  {analysisB.metrics_used?.Suitability_Score || 70} / 100
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 block">Mandate Observations:</span>
                {analysisB.supporting_evidence.map((sup, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sup}</span>
                  </div>
                ))}
                {analysisB.contradicting_evidence.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
