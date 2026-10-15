import React, { useState } from 'react';
import { InvestorProfile } from '../types';
import {
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  User,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Building2,
  Zap,
} from 'lucide-react';
import { computePortfolioMetrics } from '../data/investorProfiles';

interface LoginPageProps {
  demoProfiles: InvestorProfile[];
  onLogin: (profile: InvestorProfile) => void;
  livePriceMap?: Record<string, number>;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  demoProfiles,
  onLogin,
  livePriceMap = {},
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Match with existing demo profile or create a personalized session
    const matched = demoProfiles.find(
      p => p.name.toLowerCase().includes(customEmail.split('@')[0].toLowerCase())
    );

    if (matched) {
      onLogin(matched);
    } else {
      // Create session using balanced template
      const template = demoProfiles[1] || demoProfiles[0];
      const customProfile: InvestorProfile = {
        ...template,
        id: `user_${Date.now()}`,
        name: customName.trim() || customEmail.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
        alias: 'Custom Equity Mandate',
      };
      onLogin(customProfile);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900 font-sans">
      {/* Top Header Strip */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow-sm shadow-emerald-500/30">
              VF
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900">
                Vibe<span className="text-emerald-500">Finance</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Professional Investment & Research Platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NSE / BSE Live Market Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          {/* Left Column: Value Proposition & Branding */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fintech Intelligence for Modern Investors</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Invest with clarity, discipline, and data.
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Log in to access your portfolio analytics, quantitative technical indicators, corporate filings corpus, and institutional multi-agent synthesis.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Real-Time Exchange Data</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Live ticks, order book depth, and historical series for Nifty 50, Sensex, and individual equities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Mandate-Driven Risk Engine</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tailored position sizing caps, liquidity buffers, and concentration analytics matched to your risk profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verified Disclosures & Filings</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Semantic search across exchange announcements, investor presentations, and audited earnings reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SEBI Compliant Research Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Demo Accounts & Authentication Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-7">
            {/* Login Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Welcome to VibeFinance</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a demo account below to instantly explore the platform
                </p>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'demo'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Demo Accounts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'custom'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Login
                </button>
              </div>
            </div>

            {/* TAB 1: DEMO ACCOUNTS (PRIMARY) */}
            {activeTab === 'demo' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                    Pre-Configured Investor Profiles
                  </span>
                  <span className="text-emerald-600 font-medium">One-Click Instant Access</span>
                </div>

                <div className="space-y-3">
                  {demoProfiles.map((profile, idx) => {
                    const metrics = computePortfolioMetrics(profile, livePriceMap);
                    const isRecommended = idx === 1; // Priya Sharma (Balanced)
                    const badgeColor =
                      profile.risk_tolerance === 'Conservative'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : profile.risk_tolerance === 'Moderate'
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <div
                        key={profile.id}
                        className={`relative group rounded-xl border p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                          isRecommended
                            ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        onClick={() => onLogin(profile)}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            Recommended Mandate
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-800 text-sm group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors shrink-0">
                              {profile.name.charAt(0)}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                                  {profile.name}
                                </h3>
                                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${badgeColor}`}>
                                  {profile.risk_tolerance} Risk
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 truncate max-w-sm">
                                {profile.alias}
                              </p>

                              {/* Snapshot Metrics */}
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                                <div>
                                  <span className="text-slate-400">Portfolio: </span>
                                  <span className="font-bold text-slate-800">
                                    ₹{metrics.totalPortfolioValue.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <span>·</span>
                                <div>
                                  <span className="text-slate-400">Holdings: </span>
                                  <span className="font-semibold text-slate-700">
                                    {profile.holdings.length} stocks
                                  </span>
                                </div>
                                <span>·</span>
                                <div>
                                  <span className="text-slate-400">Cash: </span>
                                  <span className="font-semibold text-slate-700">
                                    {profile.cash_allocation_pct}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Login Button */}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onLogin(profile);
                            }}
                            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 hover:bg-emerald-500 text-slate-700 hover:text-white group-hover:bg-emerald-500 group-hover:text-white cursor-pointer shadow-xs"
                          >
                            <span>Enter</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Each demo account includes live portfolio allocations, backtested risk scores, and real NSE historical data.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM CREDENTIAL SIGN IN */}
            {activeTab === 'custom' && (
              <form onSubmit={handleCustomLogin} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email or Client ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => {
                        setCustomEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="e.g. investor@vibefinance.in"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password or PIN
                    </label>
                    <span className="text-[11px] text-emerald-600">Demo access: Any password</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="password"
                      value={customPassword}
                      onChange={e => {
                        setCustomPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In to Terminal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomEmail('priya.sharma@investor.in');
                      setCustomPassword('demo1234');
                      setCustomName('Priya Sharma');
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 cursor-pointer"
                  >
                    Auto-fill demo credentials
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} VibeFinance. Real-time Equity Research & Portfolio Analytics.
          </div>
          <div className="text-[11px] text-slate-400">
            Market Data: National Stock Exchange of India (NSE) & Bombay Stock Exchange (BSE)
          </div>
        </div>
      </footer>
    </div>
  );
};
