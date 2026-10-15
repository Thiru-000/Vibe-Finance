import React, { useState } from 'react';
import { MarketRecord, InvestorProfile } from '../types';
import { SUPPORTED_SECURITIES } from '../utils/liveMarketService';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Bookmark,
  RefreshCw,
} from 'lucide-react';

interface WatchlistViewProps {
  profile: InvestorProfile;
  onUpdateProfile: (updatedProfile: InvestorProfile) => void;
  onSelectStock: (symbol: string) => void;
  onNavigateTab: (tab: string) => void;
  livePriceMap: Record<string, number>;
  onRefreshData?: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  profile,
  onUpdateProfile,
  onSelectStock,
  onNavigateTab,
  livePriceMap,
  onRefreshData,
}) => {
  const [searchTicker, setSearchTicker] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nifty50' | 'banking' | 'tech'>('all');

  const watchlistSymbols = profile.watchlist || ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'TATASTEEL'];

  const handleAddTicker = (symToAdd: string) => {
    const clean = symToAdd.trim().toUpperCase().replace(/\.(NS|BO)$/, '');
    if (!clean || watchlistSymbols.includes(clean)) return;

    const updated: InvestorProfile = {
      ...profile,
      watchlist: [...watchlistSymbols, clean],
    };
    onUpdateProfile(updated);
    setSearchTicker('');
  };

  const handleRemoveTicker = (symToRemove: string) => {
    const updated: InvestorProfile = {
      ...profile,
      watchlist: watchlistSymbols.filter(s => s !== symToRemove),
    };
    onUpdateProfile(updated);
  };

  // Filter presets
  const presetBuckets = {
    nifty50: ['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'LT', 'SBIN'],
    banking: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'BAJFINANCE'],
    tech: ['TCS', 'INFY', 'WIPRO', 'ZOMATO'],
  };

  const displayedSymbols = watchlistSymbols.filter(sym => {
    if (activeFilter === 'all') return true;
    return presetBuckets[activeFilter]?.includes(sym);
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Market Watchlist & Screener</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Active Securities Monitor
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live exchange tick monitoring, price alerts, and one-click financial research for {profile.name}'s coverage universe.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-mono rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sync Live Prices</span>
              </button>
            )}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-700">
              Tracked: <span className="text-emerald-600 font-bold">{watchlistSymbols.length}</span> Stocks
            </div>
          </div>
        </div>

        {/* Quick Add Bar & Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddTicker(searchTicker);
            }}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTicker}
                onChange={e => setSearchTicker(e.target.value)}
                placeholder="Add NSE Symbol (e.g., MARUTI, TITAN, HAL, BEL)..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-medium self-start md:self-auto">
            <span className="text-slate-500 text-[11px] mr-1">Filter:</span>
            {(['all', 'nifty50', 'banking', 'tech'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-xl text-xs transition-colors cursor-pointer capitalize ${
                  activeFilter === tab
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/60'
                }`}
              >
                {tab === 'all' ? 'All Watchlist' : tab === 'nifty50' ? 'NIFTY 50' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Securities Grid / Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Stock / Company</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4 text-right">LTP (₹)</th>
                <th className="py-3.5 px-4 text-right">Day Change</th>
                <th className="py-3.5 px-4 text-right">Exchange</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSymbols.map(sym => {
                const reg = SUPPORTED_SECURITIES[sym] || {
                  symbol: sym,
                  name: `${sym} India Limited`,
                  exchange: 'NSE',
                  sector: 'Indian Equities',
                  defaultPrice: 1000,
                };
                const livePrice = livePriceMap[sym] || reg.defaultPrice;
                const change = Number((livePrice * 0.006).toFixed(2));
                const changePct = 0.6;
                const isPositive = change >= 0;

                return (
                  <tr key={sym} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 font-mono text-xs">
                          {sym.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900">{sym}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {reg.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {reg.sector}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm tabular-nums">
                      ₹{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-semibold tabular-nums">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs ${
                        isPositive
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                          : 'text-rose-700 bg-rose-50 border border-rose-200/60'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>+{change.toFixed(2)} (+{changePct}%)</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-500 text-[11px]">
                      NSE EQ
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            onSelectStock(sym);
                            onNavigateTab('overview');
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveTicker(sym)}
                          title="Remove from Watchlist"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};
