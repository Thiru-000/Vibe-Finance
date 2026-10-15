import React, { useState, useRef, useEffect } from 'react';
import { InvestorProfile } from '../types';
import { RefreshCw, Search, Layers, TrendingUp, X } from 'lucide-react';
import { SUPPORTED_SECURITIES } from '../utils/liveMarketService';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  selectedProfile: InvestorProfile;
  profiles: InvestorProfile[];
  onSelectProfile: (profile: InvestorProfile) => void;
  onComparePerspectives: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedSymbol,
  onSelectSymbol,
  selectedProfile,
  profiles,
  onSelectProfile,
  onComparePerspectives,
  onRefreshData,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const navTabs = [
    { id: 'overview', label: 'Terminal' },
    { id: 'market', label: 'Technical & Charts' },
    { id: 'watchlist', label: 'Watchlist & Screener' },
    { id: 'documents', label: 'Filings & Research' },
    { id: 'portfolio', label: 'Portfolio & Risk' },
    { id: 'suitability', label: 'Mandate Suitability' },
  ];

  // Filter security suggestions based on search query
  const searchResults = Object.values(SUPPORTED_SECURITIES).filter(item => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleSelectSearchResult = (symbol: string) => {
    onSelectSymbol(symbol);
    setSearchQuery('');
    setIsSearchOpen(false);
    onSelectTab('overview');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase().replace(/\.(NS|BO)$/, '');
    if (clean) {
      onSelectSymbol(clean);
      setSearchQuery('');
      setIsSearchOpen(false);
      onSelectTab('overview');
    }
  };

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-sm shadow-cyan-500/20">
              VF
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white leading-tight">
                Vibe<span className="text-cyan-400">Finance</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Institutional Terminal
              </div>
            </div>
          </button>
        </div>

        {/* Global Live Ticker Search */}
        <div ref={searchContainerRef} className="relative hidden sm:block w-48 md:w-64 lg:w-72">
          <form onSubmit={handleCustomSubmit} className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search NSE Ticker or Company..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (searchResults.length > 0 || searchQuery.trim().length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0b101d] border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden z-50 text-xs">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-800/80">
                  {searchResults.map(item => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSelectSearchResult(item.symbol)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800/60 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                          {item.symbol}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px] text-slate-500">
                        {item.sector}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleCustomSubmit}
                  className="w-full text-left px-3 py-2.5 hover:bg-slate-800/60 transition-colors text-cyan-400 font-mono text-xs cursor-pointer"
                >
                  Query NSE Live Feed for "{searchQuery.trim().toUpperCase()}" →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 border border-slate-800/80 rounded-lg p-1 text-xs">
          {navTabs.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer font-medium ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Controls: Mandate Switcher & Compare Perspectives */}
        <div className="flex items-center gap-2.5 shrink-0 text-xs">
          {/* Quick Symbol Dropdown */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-2 py-1">
            <span className="text-slate-500 text-[11px] font-mono">NSE:</span>
            <select
              value={selectedSymbol}
              onChange={e => onSelectSymbol(e.target.value)}
              className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {Object.keys(SUPPORTED_SECURITIES).map(sym => (
                <option key={sym} value={sym} className="bg-slate-900 text-slate-200 font-mono">
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Mandate Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1">
            <span className="text-slate-500 text-[11px]">Mandate:</span>
            <select
              value={selectedProfile.id}
              onChange={e => {
                const found = profiles.find(p => p.id === e.target.value);
                if (found) onSelectProfile(found);
              }}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name} ({p.risk_tolerance})
                </option>
              ))}
            </select>
          </div>

          {/* Live Refresh Button */}
          <button
            onClick={onRefreshData}
            title="Refresh Real-Time Live Feed"
            disabled={isRefreshing}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Compare Perspectives Modal Trigger */}
          <button
            onClick={onComparePerspectives}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare Perspectives</span>
          </button>
        </div>
      </div>

      {/* Responsive Navigation Tab Strip */}
      <div className="flex xl:hidden items-center gap-2 overflow-x-auto pt-2 text-xs border-t border-slate-800/60 mt-2 scrollbar-none">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer ${
              currentTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
