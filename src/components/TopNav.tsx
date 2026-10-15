import React, { useState, useRef, useEffect } from 'react';
import { InvestorProfile } from '../types';
import {
  Search,
  RefreshCw,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { SUPPORTED_SECURITIES } from '../utils/liveMarketService';

interface TopNavProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  selectedProfile: InvestorProfile;
  profiles: InvestorProfile[];
  onSelectProfile: (profile: InvestorProfile) => void;
  onComparePerspectives?: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onToggleMobileMenu: () => void;
  livePriceMap: Record<string, number>;
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  selectedSymbol,
  onSelectSymbol,
  selectedProfile,
  profiles,
  onSelectProfile,
  onRefreshData,
  isRefreshing,
  onToggleMobileMenu,
  livePriceMap,
  onLogout,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Search filter
  const searchResults = Object.values(SUPPORTED_SECURITIES).filter(item => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.sector.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const handleSelectSearchResult = (symbol: string) => {
    onSelectSymbol(symbol);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase().replace(/\.(NS|BO)$/, '');
    if (clean) {
      onSelectSymbol(clean);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Minimal Brand on mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-xs">
            VF
          </div>
          <span className="font-bold text-slate-900 text-sm">VibeFinance</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg mx-auto">
        <form onSubmit={handleCustomSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search stocks, indices, companies (e.g. INFY, TCS, Tata)..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Autocomplete Dropdown */}
        {isSearchOpen && (searchResults.length > 0 || searchQuery.trim().length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-xs">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {searchResults.map(item => (
                  <button
                    key={item.symbol}
                    onClick={() => handleSelectSearchResult(item.symbol)}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50/60 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-900 group-hover:text-emerald-600">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        {item.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        ₹{(livePriceMap[item.symbol] || item.defaultPrice).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {item.sector}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleCustomSubmit}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50/60 transition-colors text-emerald-600 font-medium text-xs cursor-pointer flex items-center justify-between"
              >
                <span>Query live exchange data for "{searchQuery.trim().toUpperCase()}"</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enter ↵</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: Market Status, Refresh, Logged-In User Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Market Status Chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NSE/BSE Open</span>
        </div>

        {/* Refresh Live Feeds */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          title="Sync Real-Time Market Feeds"
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* Authenticated User Menu */}
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs group-hover:bg-emerald-200 transition-colors">
              {selectedProfile.name.charAt(0)}
            </div>
            <span className="hidden md:inline truncate max-w-[120px]">{selectedProfile.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>

          {/* User Account Popover */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in fade-in-50 duration-150">
              {/* Account Header */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {selectedProfile.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate">
                      {selectedProfile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {selectedProfile.name.toLowerCase().replace(/\s+/g, '.')}@investor.in
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        KYC Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Risk Mandate</span>
                    <span className="font-semibold text-slate-800">{selectedProfile.risk_tolerance}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Horizon</span>
                    <span className="font-semibold text-slate-800">{selectedProfile.time_horizon.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1">
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onNavigateTab('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Mandate & Risk Settings</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Switch Demo Account</span>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-mono">
                      Log Out
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
