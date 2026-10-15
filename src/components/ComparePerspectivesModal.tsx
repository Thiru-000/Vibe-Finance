import React, { useState, useEffect } from 'react';
import { InvestorProfile, MarketRecord, AgentOutput } from '../types';
import { runInvestorRiskAgent } from '../utils/agentOrchestrator';
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { computePortfolioMetrics } from '../data/investorProfiles';

interface ComparePerspectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuote: MarketRecord;
  profiles: InvestorProfile[];
}

export const ComparePerspectivesModal: React.FC<ComparePerspectivesModalProps> = ({
  isOpen,
  onClose,
  currentQuote,
  profiles,
}) => {
  const [profileAId, setProfileAId] = useState<string>(profiles[0]?.id || 'profile_conservative');
  const [profileBId, setProfileBId] = useState<string>(profiles[2]?.id || 'profile_growth');
  const [analysisA, setAnalysisA] = useState<AgentOutput | null>(null);
  const [analysisB, setAnalysisB] = useState<AgentOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const profileA = profiles.find(p => p.id === profileAId) || profiles[0];
  const profileB = profiles.find(p => p.id === profileBId) || profiles[1];

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, profileAId, profileBId, currentQuote]);

  if (!isOpen) return null;

  const metricsA = computePortfolioMetrics(profileA);
  const metricsB = computePortfolioMetrics(profileB);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Mandate Suitability Screen</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Investor Perspective Comparison: <span className="text-emerald-600">{currentQuote.symbol}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identical market quote (₹{currentQuote.close.toFixed(2)}, {currentQuote.changePercent}%) screened against distinct risk tolerances, cash allocations, and portfolio concentration limits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Side-by-Side Columns */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perspective A */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Perspective 1</span>
                  <select
                    value={profileAId}
                    onChange={e => setProfileAId(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-2.5 py-1.5 mt-1 focus:outline-none cursor-pointer"
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

              {/* Profile Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-500 block font-sans">Time Horizon:</span>
                  <span className="text-slate-900 font-semibold">{profileA.time_horizon}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-sans">Max Position:</span>
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

              {/* Evaluation */}
              {isCalculating ? (
                <div className="py-6 text-center text-slate-400 font-mono text-xs">
                  Evaluating suitability...
                </div>
              ) : analysisA ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-700">Suitability Rating:</span>
                    <span className="text-sm font-bold font-mono text-emerald-600">
                      {analysisA.metrics_used?.Suitability_Score || 75} / 100
                    </span>
                  </div>

                  <div className="space-y-1.5">
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

            {/* Perspective B */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Perspective 2</span>
                  <select
                    value={profileBId}
                    onChange={e => setProfileBId(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-2.5 py-1.5 mt-1 focus:outline-none cursor-pointer"
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

              {/* Profile Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-500 block font-sans">Time Horizon:</span>
                  <span className="text-slate-900 font-semibold">{profileB.time_horizon}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-sans">Max Position:</span>
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

              {/* Evaluation */}
              {isCalculating ? (
                <div className="py-6 text-center text-slate-400 font-mono text-xs">
                  Evaluating suitability...
                </div>
              ) : analysisB ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-700">Suitability Rating:</span>
                    <span className="text-sm font-bold font-mono text-amber-700">
                      {analysisB.metrics_used?.Suitability_Score || 70} / 100
                    </span>
                  </div>

                  <div className="space-y-1.5">
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

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium cursor-pointer transition-colors text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
