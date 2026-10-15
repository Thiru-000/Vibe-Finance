import React, { useState } from 'react';
import { InvestorProfile } from '../types';
import {
  Settings,
  ShieldCheck,
  User,
  Sliders,
  Check,
  RotateCcw,
  Bell,
  Database,
  LogOut,
} from 'lucide-react';
import { DEFAULT_INVESTOR_PROFILES, saveProfiles } from '../data/investorProfiles';

interface SettingsViewProps {
  selectedProfile: InvestorProfile;
  profiles: InvestorProfile[];
  onUpdateProfile: (updatedProfile: InvestorProfile) => void;
  onSelectProfile: (profile: InvestorProfile) => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedProfile,
  profiles,
  onUpdateProfile,
  onSelectProfile,
  onLogout,
}) => {
  const [name, setName] = useState(selectedProfile.name);
  const [alias, setAlias] = useState(selectedProfile.alias);
  const [riskTolerance, setRiskTolerance] = useState(selectedProfile.risk_tolerance);
  const [timeHorizon, setTimeHorizon] = useState(selectedProfile.time_horizon);
  const [maxPositionCap, setMaxPositionCap] = useState(selectedProfile.max_single_position_pct);
  const [cashAllocation, setCashAllocation] = useState(selectedProfile.cash_allocation_pct);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if selectedProfile changes
  React.useEffect(() => {
    setName(selectedProfile.name);
    setAlias(selectedProfile.alias);
    setRiskTolerance(selectedProfile.risk_tolerance);
    setTimeHorizon(selectedProfile.time_horizon);
    setMaxPositionCap(selectedProfile.max_single_position_pct);
    setCashAllocation(selectedProfile.cash_allocation_pct);
  }, [selectedProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: InvestorProfile = {
      ...selectedProfile,
      name,
      alias,
      risk_tolerance: riskTolerance,
      time_horizon: timeHorizon,
      max_single_position_pct: Number(maxPositionCap),
      cash_allocation_pct: Number(cashAllocation),
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    saveProfiles(DEFAULT_INVESTOR_PROFILES);
    onSelectProfile(DEFAULT_INVESTOR_PROFILES[1]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Preferences & Risk Configuration</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Investor Profile & Mandate Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure risk tolerance parameters, concentration caps, and cash liquidity buffers used by the quantitative analysis models.
        </p>
      </div>

      {/* Select Active Profile */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Preset Investor Profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                p.id === selectedProfile.id
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{p.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                  p.risk_tolerance === 'Conservative'
                    ? 'bg-blue-50 text-blue-700'
                    : p.risk_tolerance === 'Moderate'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {p.risk_tolerance}
                </span>
              </div>
              <div className="text-xs text-slate-500 line-clamp-2">{p.alias}</div>
              <div className="mt-3 text-[11px] font-mono text-slate-600 flex justify-between">
                <span>Cap: {p.max_single_position_pct}%</span>
                <span>Cash: {p.cash_allocation_pct}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Edit Mandate: {selectedProfile.name}
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mandate Description / Alias</label>
              <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Risk Tolerance</label>
              <select
                value={riskTolerance}
                onChange={e => setRiskTolerance(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="Conservative">Conservative (Capital Preservation)</option>
                <option value="Moderate">Moderate (Core & Satellite)</option>
                <option value="Aggressive">Aggressive (High-Beta Growth)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Time Horizon</label>
              <select
                value={timeHorizon}
                onChange={e => setTimeHorizon(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="Short-Term (< 6M)">Short-Term (&lt; 6M)</option>
                <option value="Medium-Term (6M-3Y)">Medium-Term (6M-3Y)</option>
                <option value="Long-Term (3Y+)">Long-Term (3Y+)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Max Single-Holding Cap (%)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={maxPositionCap}
                onChange={e => setMaxPositionCap(parseFloat(e.target.value) || 15)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Triggers concentration alert if holding exceeds this percentage of portfolio.
              </span>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Cash Reserve (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={cashAllocation}
                onChange={e => setCashAllocation(parseFloat(e.target.value) || 15)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Liquid buffer preserved for defensive averaging and dry powder.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Profiles</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-xs shadow-emerald-500/20 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Mandate Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feed & Data Reliability Details */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-slate-900">Exchange Connection & Data Engine</h3>
        <div className="space-y-2 text-slate-600">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span>Primary Market Ingestion Feed:</span>
            <span className="font-mono font-bold text-slate-900">National Stock Exchange of India (NSE)</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span>Benchmark Indices:</span>
            <span className="font-mono font-bold text-slate-900">NIFTY 50, SENSEX 30, BANK NIFTY, NIFTY IT, INDIA VIX</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span>Corporate Disclosures Corpus:</span>
            <span className="font-mono font-bold text-emerald-600">BSE/NSE Verified Exchange Archives</span>
          </div>
        </div>
      </div>

      {/* Account Session & Logout */}
      {onLogout && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account Session</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Currently signed in as <span className="font-bold text-slate-800">{selectedProfile.name}</span> ({selectedProfile.risk_tolerance} Mandate).
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Demo Account / Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
