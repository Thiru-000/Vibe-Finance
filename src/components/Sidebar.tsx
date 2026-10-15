import React from 'react';
import { InvestorProfile } from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  Sparkles,
  FileText,
  Briefcase,
  Bookmark,
  Bell,
  Settings,
  ChevronRight,
  ShieldCheck,
  X,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedProfile: InvestorProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedProfile,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'market', label: 'Markets', icon: TrendingUp },
    { id: 'ai_intelligence', label: 'AI Intelligence', icon: Sparkles },
    { id: 'documents', label: 'Stock Research', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => {
                onSelectTab('overview');
                onCloseMobile();
              }}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow-sm shadow-emerald-500/30">
                VF
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight text-slate-900">
                  Vibe<span className="text-emerald-500">Finance</span>
                </div>
                <div className="text-[10px] text-slate-600 font-medium tracking-wide">
                  Investment Intelligence
                </div>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Connection Status */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onSelectTab('settings');
                onCloseMobile();
              }}
              className="flex-1 flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors text-left cursor-pointer group min-w-0"
              title="Open Account & Risk Settings"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedProfile.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-600">
                    {selectedProfile.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {selectedProfile.risk_tolerance} Mandate
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
            </button>

            {onLogout && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onLogout();
                }}
                title="Switch Demo Account / Log Out"
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 mt-2.5 px-1 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NSE/BSE Real-Time Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
};
