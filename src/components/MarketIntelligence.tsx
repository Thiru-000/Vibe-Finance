import React, { useState } from 'react';
import { MarketRecord, OHLCVPoint } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Layers,
  BarChart2,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { computeTechnicalIndicators, computeVolumeMetrics } from '../utils/technicalMath';

interface MarketIntelligenceProps {
  currentQuote: MarketRecord;
  history: OHLCVPoint[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({
  currentQuote,
  history,
  selectedSymbol,
  onSelectSymbol,
}) => {
  const [timeframe, setTimeframe] = useState<'30D' | '60D' | 'ALL'>('60D');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [activeSubChart, setActiveSubChart] = useState<'volume' | 'rsi'>('volume');

  const filteredHistory =
    timeframe === '30D' ? history.slice(-30) : timeframe === '60D' ? history.slice(-60) : history;

  const tech = computeTechnicalIndicators(
    currentQuote.symbol,
    history,
    currentQuote.data_quality_status
  );

  const volumes = history.map(h => h.volume);
  const closes = history.map(h => h.close);
  const vol = computeVolumeMetrics(currentQuote.symbol, volumes, closes);

  // Pivot Point Calculations (Classical Pivot)
  const pp = Number(((currentQuote.high + currentQuote.low + currentQuote.close) / 3).toFixed(2));
  const r1 = Number((2 * pp - currentQuote.low).toFixed(2));
  const s1 = Number((2 * pp - currentQuote.high).toFixed(2));
  const r2 = Number((pp + (currentQuote.high - currentQuote.low)).toFixed(2));
  const s2 = Number((pp - (currentQuote.high - currentQuote.low)).toFixed(2));

  const handleExportCSV = () => {
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'SMA20', 'SMA50', 'RSI14'];
    const rows = history.map(h => [
      h.date,
      h.open,
      h.high,
      h.low,
      h.close,
      h.volume,
      h.sma20 ?? '',
      h.sma50 ?? '',
      h.rsi ?? '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentQuote.symbol}_NSE_OHLCV_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs space-y-1 font-mono">
          <div className="text-slate-500 font-sans font-medium text-[11px] pb-1 border-b border-slate-100">
            {label} · NSE Daily Bar
          </div>
          <div className="text-slate-900 flex justify-between gap-4 font-bold">
            <span className="text-slate-500 font-sans font-normal">Close:</span>
            <span>₹{data.close.toFixed(2)}</span>
          </div>
          <div className="text-slate-600 flex justify-between gap-4 text-[11px]">
            <span className="font-sans">High / Low:</span>
            <span>₹{data.high} / ₹{data.low}</span>
          </div>
          {data.sma20 && (
            <div className="text-emerald-600 flex justify-between gap-4 text-[11px]">
              <span className="font-sans">SMA(20):</span>
              <span>₹{data.sma20}</span>
            </div>
          )}
          {data.sma50 && (
            <div className="text-amber-600 flex justify-between gap-4 text-[11px]">
              <span className="font-sans">SMA(50):</span>
              <span>₹{data.sma50}</span>
            </div>
          )}
          <div className="text-slate-600 flex justify-between gap-4 text-[11px]">
            <span className="font-sans">Volume:</span>
            <span>{data.volume.toLocaleString('en-IN')}</span>
          </div>
          {data.rsi && (
            <div className="text-indigo-600 flex justify-between gap-4 text-[11px]">
              <span className="font-sans">RSI(14):</span>
              <span>{data.rsi}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
            Technical Analysis & Market Liquidity
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            {currentQuote.name} ({currentQuote.symbol})
          </h2>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            ₹{currentQuote.close.toFixed(2)} · {currentQuote.change >= 0 ? '+' : ''}{currentQuote.changePercent}% on the day
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {(['30D', '60D', 'ALL'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-emerald-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Subchart toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveSubChart('volume')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                activeSubChart === 'volume'
                  ? 'bg-white text-emerald-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setActiveSubChart('rsi')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                activeSubChart === 'rsi'
                  ? 'bg-white text-emerald-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RSI (14)
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        {/* Overlays Legend & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showSMA20}
                onChange={e => setShowSMA20(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-500 rounded" />
                <span>SMA (20)</span>
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showSMA50}
                onChange={e => setShowSMA50(e.target.checked)}
                className="accent-amber-600 rounded"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-500 rounded" />
                <span>SMA (50)</span>
              </span>
            </label>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Time Series: Daily NSE Ticks · {filteredHistory.length} trading sessions
          </div>
        </div>

        {/* Price & Moving Averages Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={v => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="close"
                name="Close"
                stroke="#0f172a"
                strokeWidth={2}
                dot={false}
              />
              {showSMA20 && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  name="SMA 20"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
              {showSMA50 && (
                <Line
                  type="monotone"
                  dataKey="sma50"
                  name="SMA 50"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Sub-Chart: Volume or RSI */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {activeSubChart === 'volume' ? 'Volume (Shares Traded)' : 'Wilder Relative Strength Index (RSI 14)'}
            </span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeSubChart === 'volume' ? (
                <ComposedChart data={filteredHistory} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} hide />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              ) : (
                <ComposedChart data={filteredHistory} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} hide />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} ticks={[30, 50, 70]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '70 (Overbought)', fill: '#f43f5e', fontSize: 10 }} />
                  <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" label={{ value: '30 (Oversold)', fill: '#10b981', fontSize: 10 }} />
                  <Line type="monotone" dataKey="rsi" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Technical & Quantitative Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pivot Points Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Support & Resistance</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Classical Pivot Levels</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Pivot: ₹{pp}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 text-rose-700">
              <span className="font-sans font-medium">Resistance 2 (R2):</span>
              <span className="font-bold">₹{r2}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/30 text-rose-600">
              <span className="font-sans font-medium">Resistance 1 (R1):</span>
              <span className="font-bold">₹{r1}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-900 font-bold">
              <span className="font-sans font-medium">Pivot Point (PP):</span>
              <span>₹{pp}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/30 text-emerald-600">
              <span className="font-sans font-medium">Support 1 (S1):</span>
              <span className="font-bold">₹{s1}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 text-emerald-700">
              <span className="font-sans font-medium">Support 2 (S2):</span>
              <span className="font-bold">₹{s2}</span>
            </div>
          </div>
        </div>

        {/* Quantitative Metrics Summary */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Volatility & Returns</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">Statistical Profiling</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 font-sans text-[11px] block">1-Day Return</span>
              <span className={`text-sm font-bold mt-0.5 block ${tech.return1d >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tech.return1d >= 0 ? '+' : ''}{tech.return1d}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 font-sans text-[11px] block">5-Day Return</span>
              <span className={`text-sm font-bold mt-0.5 block ${tech.return5d >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tech.return5d >= 0 ? '+' : ''}{tech.return5d}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 font-sans text-[11px] block">20-Day Return</span>
              <span className={`text-sm font-bold mt-0.5 block ${tech.return20d >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tech.return20d >= 0 ? '+' : ''}{tech.return20d}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 font-sans text-[11px] block">20D Volatility (Ann.)</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {tech.volatility20d}%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
            <span>Trend Direction:</span>
            <span className="font-bold text-emerald-600 font-mono">{tech.trendDirection}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
