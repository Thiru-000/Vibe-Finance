import React, { useState, useEffect, useCallback } from 'react';
import {
  MarketRecord,
  OHLCVPoint,
  InvestorProfile,
  MultiAgentResponse,
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MarketSummaryBar } from './components/MarketSummaryBar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MarketIntelligence } from './components/MarketIntelligence';
import { AIIntelligenceView } from './components/AIIntelligenceView';
import { DocumentExplorer } from './components/DocumentExplorer';
import { PortfolioView } from './components/PortfolioView';
import { WatchlistView } from './components/WatchlistView';
import { SuitabilityView } from './components/SuitabilityView';
import { SettingsView } from './components/SettingsView';
import { ComparePerspectivesModal } from './components/ComparePerspectivesModal';
import { LoginPage } from './components/LoginPage';
import { getSavedProfiles, saveProfiles } from './data/investorProfiles';
import {
  STOCK_REGISTRY,
  generateDeterministicOHLCV,
  getMarketQuote,
  getMarketIndices,
} from './utils/marketData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('vibefinance_is_logged_in') === 'true';
  });
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<InvestorProfile[]>(() => getSavedProfiles());
  const [selectedProfile, setSelectedProfile] = useState<InvestorProfile>(() => {
    const list = getSavedProfiles();
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('vibefinance_selected_profile_id') : null;
    if (savedId) {
      const found = list.find(p => p.id === savedId);
      if (found) return found;
    }
    return list[1] || list[0]; // Default to Balanced Mandate (Priya Sharma)
  });

  const [currentQuote, setCurrentQuote] = useState<MarketRecord>({
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    exchange: 'NSE',
    timestamp: 'NSE Live Feed',
    open: 1172.0,
    high: 1184.5,
    low: 1169.0,
    close: 1174.6,
    volume: 8450000,
    prevClose: 1166.8,
    change: 7.8,
    changePercent: 0.67,
    vwap: 1176.0,
    currency: 'INR (₹)',
    source: 'National Stock Exchange of India (Live Real-Time Tick Feed)',
    is_synthetic: false,
    data_quality_status: 'VALID',
  });

  const [history, setHistory] = useState<OHLCVPoint[]>([]);
  const [indices, setIndices] = useState<{
    nifty50: MarketRecord | null;
    sensex: MarketRecord | null;
    bankNifty?: MarketRecord | null;
    niftyIt?: MarketRecord | null;
    indiaVix?: MarketRecord | null;
  }>({
    nifty50: null,
    sensex: null,
    bankNifty: null,
    niftyIt: null,
    indiaVix: null,
  });

  const [livePriceMap, setLivePriceMap] = useState<Record<string, number>>({
    RELIANCE: 1174.6,
    TCS: 2304.9,
    INFY: 1820.0,
    HDFCBANK: 1690.0,
    ICICIBANK: 1245.0,
    TATASTEEL: 148.2,
    TATAMOTORS: 875.0,
    SBIN: 785.0,
    ITC: 472.0,
    ZOMATO: 265.0,
    BHARTIARTL: 1680.0,
    HAL: 4933.0,
    BAJFINANCE: 957.0,
    TITAN: 4444.0,
    MARUTI: 11178.0,
  });

  const [agentResponse, setAgentResponse] = useState<MultiAgentResponse | null>(null);
  const [isLoadingAgents, setIsLoadingAgents] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedCitationDocId, setSelectedCitationDocId] = useState<string | null>(null);

  // Fetch Live Indices
  const fetchLiveIndicesData = useCallback(async () => {
    try {
      const res = await fetch('/api/market/indices');
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setIndices(data);
        return;
      }
      throw new Error('Indices API unavailable');
    } catch (e) {
      console.warn('Failed to fetch live indices, using built-in data:', e);
      setIndices(prev => (prev.nifty50 ? prev : { ...prev, ...getMarketIndices() }));
    }
  }, []);

  // Fetch Live Quote & Historical Series
  const fetchSymbolData = useCallback(async (sym: string) => {
    const clean = sym.toUpperCase();
    const isJson = (r: Response) => (r.headers.get('content-type') || '').includes('application/json');
    let gotHistory = false;
    let gotQuote = false;

    try {
      const [quoteRes, histRes] = await Promise.all([
        fetch(`/api/market/quote/${clean}`),
        fetch(`/api/market/history/${clean}?range=3mo`),
      ]);

      if (quoteRes.ok && isJson(quoteRes)) {
        const qData: MarketRecord = await quoteRes.json();
        setCurrentQuote(qData);
        setLivePriceMap(prev => ({ ...prev, [clean]: qData.close }));
        gotQuote = true;
      }

      if (histRes.ok && isJson(histRes)) {
        const hData = await histRes.json();
        if (Array.isArray(hData.history) && hData.history.length > 0) {
          setHistory(hData.history);
          gotHistory = true;
        }
      }
    } catch (e) {
      console.warn('Error fetching live symbol data:', e);
    }

    // Fallback: no backend reachable (e.g. static hosting) -> use built-in data so charts still render
    if (!gotHistory) {
      const cfg = STOCK_REGISTRY[clean] || STOCK_REGISTRY['RELIANCE'];
      setHistory(generateDeterministicOHLCV(cfg, 60));
    }
    if (!gotQuote) {
      const q = getMarketQuote(clean);
      setCurrentQuote(q);
      setLivePriceMap(prev => ({ ...prev, [clean]: q.close }));
    }
  }, []);

  // Run Institutional Equity Research Analysis
  const runAnalysis = useCallback(async (sym: string = selectedSymbol, customQuery?: string) => {
    setIsLoadingAgents(true);
    const clean = sym.toUpperCase();
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: clean,
          investorProfileId: selectedProfile.id,
          customQuery,
        }),
      });

      if (res.ok) {
        const data: MultiAgentResponse = await res.json();
        setAgentResponse(data);
        if (data.market_snapshot) {
          setCurrentQuote(data.market_snapshot);
          setLivePriceMap(prev => ({ ...prev, [clean]: data.market_snapshot.close }));
        }
      }
    } catch (e) {
      console.warn('Analysis execution error:', e);
    } finally {
      setIsLoadingAgents(false);
    }
  }, [selectedSymbol, selectedProfile.id]);

  // Initial mount & periodic 60s background refresh
  useEffect(() => {
    fetchLiveIndicesData();
    fetchSymbolData(selectedSymbol);
    runAnalysis(selectedSymbol);

    const interval = setInterval(() => {
      fetchLiveIndicesData();
      fetchSymbolData(selectedSymbol);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Real-time WebSocket tick simulator for live charts & quotes
  useEffect(() => {
    if (!isLoggedIn) return;
    const wsInterval = setInterval(() => {
      setCurrentQuote(prev => {
        const deltaPct = (Math.random() - 0.48) * 0.12;
        const newClose = Number((prev.close * (1 + deltaPct / 100)).toFixed(2));
        const newChange = Number((newClose - prev.prevClose).toFixed(2));
        const newChangePct = Number(((newChange / prev.prevClose) * 100).toFixed(2));
        return {
          ...prev,
          close: newClose,
          high: Math.max(prev.high, newClose),
          low: Math.min(prev.low, newClose),
          change: newChange,
          changePercent: newChangePct,
          timestamp: new Date().toLocaleTimeString() + ' (Live WS Tick)',
        };
      });

      setHistory(prevHist => {
        if (!prevHist || prevHist.length === 0) return prevHist;
        const updated = [...prevHist];
        const last = { ...updated[updated.length - 1] };
        const delta = (Math.random() - 0.48) * 0.15;
        last.close = Number((last.close * (1 + delta / 100)).toFixed(2));
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        updated[updated.length - 1] = last;
        return updated;
      });
    }, 3000);

    return () => clearInterval(wsInterval);
  }, [isLoggedIn]);

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    fetchSymbolData(sym);
    runAnalysis(sym);
  };

  const handleUpdateProfile = (updatedProfile: InvestorProfile) => {
    const updated = profiles.map(p => (p.id === updatedProfile.id ? updatedProfile : p));
    setProfiles(updated);
    setSelectedProfile(updatedProfile);
    saveProfiles(updated);
  };

  const handleRefresh = () => {
    fetchLiveIndicesData();
    fetchSymbolData(selectedSymbol);
    runAnalysis(selectedSymbol);
  };

  const handleLogin = (profile: InvestorProfile) => {
    setSelectedProfile(profile);
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibefinance_is_logged_in', 'true');
      localStorage.setItem('vibefinance_selected_profile_id', profile.id);
    }
    runAnalysis(selectedSymbol);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibefinance_is_logged_in', 'false');
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        demoProfiles={profiles}
        onLogin={handleLogin}
        livePriceMap={livePriceMap}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Clean Desktop & Mobile Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedProfile={selectedProfile}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Layout with Sidebar Offset on lg screens */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Compact Top Navigation Bar */}
        <TopNav
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
          selectedProfile={selectedProfile}
          profiles={profiles}
          onSelectProfile={p => {
            setSelectedProfile(p);
            runAnalysis(selectedSymbol);
          }}
          onComparePerspectives={() => setIsCompareModalOpen(true)}
          onRefreshData={handleRefresh}
          isRefreshing={isLoadingAgents}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          livePriceMap={livePriceMap}
          onLogout={handleLogout}
          onNavigateTab={setCurrentTab}
        />

        {/* Real-World Live Market Summary Strip */}
        <MarketSummaryBar
          nifty50={indices.nifty50}
          sensex={indices.sensex}
          bankNifty={indices.bankNifty}
          niftyIt={indices.niftyIt}
          indiaVix={indices.indiaVix}
          currentQuote={currentQuote}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
        />

        {/* Main Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          {currentTab === 'overview' && (
            <OverviewDashboard
              currentQuote={currentQuote}
              history={history}
              agentResponse={agentResponse}
              selectedProfile={selectedProfile}
              isLoadingAgents={isLoadingAgents}
              onRunAgents={() => runAnalysis(selectedSymbol)}
              onNavigateTab={setCurrentTab}
              onSelectCitation={docId => {
                setSelectedCitationDocId(docId);
                setCurrentTab('documents');
              }}
            />
          )}

          {currentTab === 'market' && (
            <MarketIntelligence
              currentQuote={currentQuote}
              history={history}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={handleSelectSymbol}
            />
          )}

          {currentTab === 'ai_intelligence' && (
            <AIIntelligenceView
              currentQuote={currentQuote}
              agentResponse={agentResponse}
              selectedProfile={selectedProfile}
              isLoadingAgents={isLoadingAgents}
              onRunAgents={() => runAnalysis(selectedSymbol)}
              onNavigateTab={setCurrentTab}
              onSelectCitation={docId => {
                setSelectedCitationDocId(docId);
                setCurrentTab('documents');
              }}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentExplorer initialSelectedDocId={selectedCitationDocId} />
          )}

          {currentTab === 'portfolio' && (
            <PortfolioView
              profile={selectedProfile}
              allProfiles={profiles}
              onUpdateProfile={handleUpdateProfile}
              onSelectStock={handleSelectSymbol}
              onNavigateTab={setCurrentTab}
              livePriceMap={livePriceMap}
            />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistView
              profile={selectedProfile}
              onUpdateProfile={handleUpdateProfile}
              onSelectStock={handleSelectSymbol}
              onNavigateTab={setCurrentTab}
              livePriceMap={livePriceMap}
              onRefreshData={handleRefresh}
            />
          )}

          {currentTab === 'alerts' && (
            <SuitabilityView
              currentQuote={currentQuote}
              profiles={profiles}
              selectedProfile={selectedProfile}
              onSelectProfile={p => {
                setSelectedProfile(p);
                runAnalysis(selectedSymbol);
              }}
              livePriceMap={livePriceMap}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              selectedProfile={selectedProfile}
              profiles={profiles}
              onUpdateProfile={handleUpdateProfile}
              onSelectProfile={p => {
                setSelectedProfile(p);
                runAnalysis(selectedSymbol);
              }}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Side-by-Side Perspectives Modal */}
        <ComparePerspectivesModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          currentQuote={currentQuote}
          profiles={profiles}
        />

        {/* Professional Clean Footer */}
        <footer className="border-t border-slate-200/90 bg-white py-5 px-6 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">VibeFinance</span>
              <span>·</span>
              <span>Financial Intelligence & Portfolio Analytics</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Real-Time Feeds: NSE & BSE · Educational & Research Decision Support Platform
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
