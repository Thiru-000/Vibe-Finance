import React, { useState } from 'react';
import { InvestorProfile, HoldingItem } from '../types';
import { computePortfolioMetrics } from '../data/investorProfiles';
import {
  Briefcase,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  ShieldCheck,
  ExternalLink,
  X,
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

interface PortfolioViewProps {
  profile: InvestorProfile;
  allProfiles: InvestorProfile[];
  onUpdateProfile: (updatedProfile: InvestorProfile) => void;
  onSelectStock: (symbol: string) => void;
  onNavigateTab: (tab: string) => void;
  livePriceMap?: Record<string, number>;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  profile,
  allProfiles,
  onUpdateProfile,
  onSelectStock,
  onNavigateTab,
  livePriceMap = {},
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newSector, setNewSector] = useState('Banking & Financial Services');
  const [newQty, setNewQty] = useState<number>(50);
  const [newAvgPrice, setNewAvgPrice] = useState<number>(1000);

  const metrics = computePortfolioMetrics(profile, livePriceMap);

  const SECTOR_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  const sectorChartData = Object.entries(profile.sector_exposure).map(([sector, pct]) => ({
    name: sector,
    value: pct,
  }));

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;

    const sym = newSymbol.toUpperCase().trim();
    const currentP = livePriceMap[sym] || Number(newAvgPrice);

    const newHolding: HoldingItem = {
      symbol: sym,
      company_name: newCompanyName.trim() || `${sym} Limited`,
      sector: newSector,
      quantity: Number(newQty),
      avg_price: Number(newAvgPrice),
      current_price: currentP,
    };

    const updatedHoldings = [...profile.holdings, newHolding];
    const updated = { ...profile, holdings: updatedHoldings };
    onUpdateProfile(updated);
    setShowAddModal(false);
    setNewSymbol('');
    setNewCompanyName('');
  };

  const handleRemoveHolding = (symbol: string) => {
    const updatedHoldings = profile.holdings.filter(h => h.symbol !== symbol);
    const updated = { ...profile, holdings: updatedHoldings };
    onUpdateProfile(updated);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Investment Portfolio & Risk Allocation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              {profile.name} — <span className="text-slate-500 font-normal">{profile.alias}</span>
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {profile.risk_tolerance} Mandate
              </span>
              <span>·</span>
              <span>Horizon: {profile.time_horizon}</span>
              <span>·</span>
              <span>Max Single Position Cap: {profile.max_single_position_pct}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-all shadow-xs shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Holding</span>
            </button>
          </div>
        </div>

        {/* Portfolio KPI Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-500 font-sans text-[11px]">Total Portfolio Value</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              ₹{metrics.totalPortfolioValue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-500 font-sans text-[11px]">Invested Capital</div>
            <div className="text-2xl font-bold text-slate-700 tabular-nums mt-1">
              ₹{metrics.investedTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-500 font-sans text-[11px]">Total Unrealized P&L</div>
            <div className={`text-2xl font-bold tabular-nums mt-1 ${metrics.unrealizedPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {metrics.unrealizedPnL >= 0 ? '+' : ''}₹{metrics.unrealizedPnL.toLocaleString('en-IN')} ({metrics.unrealizedPnLPct}%)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-500 font-sans text-[11px]">Cash Buffer</div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">
              ₹{metrics.cashAmount.toLocaleString('en-IN')} ({profile.cash_allocation_pct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Current Equity Holdings</h3>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">
              {profile.holdings.length} securities tracked with live exchange quotes
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Company / Symbol</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4 text-right">Shares</th>
                <th className="py-3.5 px-4 text-right">Avg Price</th>
                <th className="py-3.5 px-4 text-right">Live LTP</th>
                <th className="py-3.5 px-4 text-right">Current Value</th>
                <th className="py-3.5 px-4 text-right">Total P&L</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profile.holdings.map(h => {
                const liveP = livePriceMap[h.symbol] || h.current_price;
                const totalVal = h.quantity * liveP;
                const cost = h.quantity * h.avg_price;
                const pnl = totalVal - cost;
                const pnlPct = cost > 0 ? Number(((pnl / cost) * 100).toFixed(2)) : 0;
                const isPos = pnl >= 0;

                return (
                  <tr key={h.symbol} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 font-mono text-xs">
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900">{h.symbol}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {h.company_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{h.sector}</td>
                    <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900">
                      {h.quantity}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600">
                      ₹{h.avg_price.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{liveP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold">
                      <span className={`inline-flex items-center gap-1 ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPos ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 0 })} ({isPos ? '+' : ''}{pnlPct}%)
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            onSelectStock(h.symbol);
                            onNavigateTab('overview');
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Open in Terminal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveHolding(h.symbol)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Remove Holding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector Allocation Breakdown & Concentration Metric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Asset Distribution</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Sector Exposure</h3>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(profile.sector_exposure).map(([sector, pct], idx) => (
              <div key={sector} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{sector}</span>
                  <span className="text-slate-900 font-mono font-bold">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Risk Analytics</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">Portfolio Concentration & Health</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Concentration Score (HHI)</span>
                <span className="text-slate-500 text-[11px]">Normalized Herfindahl-Hirschman Index</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-600">
                {metrics.concentrationScore} / 100
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Max Single Holding Cap</span>
                <span className="text-slate-500 text-[11px]">Mandate Ceiling Limit</span>
              </div>
              <span className="text-xl font-bold font-mono text-slate-900">
                {profile.max_single_position_pct}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Mandate Alignment Status</span>
                <span className="text-slate-500 text-[11px]">Compliance with risk ceiling</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Fully Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Stock to Portfolio</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHolding} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NSE Symbol</label>
                <input
                  type="text"
                  required
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. INFY, TCS, RELIANCE"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Infosys Limited"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQty}
                    onChange={e => setNewQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Avg Buy Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.05"
                    required
                    value={newAvgPrice}
                    onChange={e => setNewAvgPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sector</label>
                <select
                  value={newSector}
                  onChange={e => setNewSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Energy & Retail Conglomerate">Energy & Retail Conglomerate</option>
                  <option value="Metals & Mining">Metals & Mining</option>
                  <option value="Automobile">Automobile</option>
                  <option value="Consumer Internet & Logistics">Consumer Internet & Logistics</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs shadow-emerald-500/20"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
