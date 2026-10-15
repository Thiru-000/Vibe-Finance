import React from 'react';
import { MarketRecord } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketSummaryBarProps {
  nifty50: MarketRecord | null;
  sensex: MarketRecord | null;
  bankNifty?: MarketRecord | null;
  niftyIt?: MarketRecord | null;
  indiaVix?: MarketRecord | null;
  currentQuote?: MarketRecord;
  selectedSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
}

export const MarketSummaryBar: React.FC<MarketSummaryBarProps> = ({
  nifty50,
  sensex,
  bankNifty,
  niftyIt,
  indiaVix,
}) => {
  const indicesList = [
    { label: 'NIFTY 50', data: nifty50 },
    { label: 'SENSEX', data: sensex },
    { label: 'BANK NIFTY', data: bankNifty },
    { label: 'NIFTY IT', data: niftyIt },
    { label: 'INDIA VIX', data: indiaVix },
  ].filter(item => item.data != null);

  return (
    <div className="bg-white border-b border-slate-200/80 py-2.5 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Market Benchmark Index Cards */}
        <div className="flex items-center gap-3 overflow-x-auto w-full scrollbar-none py-0.5">
          {indicesList.map(item => {
            const ind = item.data!;
            const isPos = ind.change >= 0;
            return (
              <div
                key={item.label}
                className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 rounded-xl px-3.5 py-1.5 shrink-0 transition-colors cursor-default"
              >
                <div className="flex items-center justify-between gap-4 mb-0.5">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold ${
                      isPos ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>
                      {isPos ? '+' : ''}{ind.changePercent}%
                    </span>
                  </span>
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  {ind.close.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
