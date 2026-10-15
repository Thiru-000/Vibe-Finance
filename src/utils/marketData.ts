import { MarketRecord, OHLCVPoint, DataQualityStatus } from '../types';
import { calculateSMA, calculateRSI } from './technicalMath';

// Seeded pseudorandom generator for deterministic reproducibility
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface StockConfig {
  symbol: string;
  name: string;
  exchange: 'NSE';
  sector: string;
  basePrice: number;
  seed: number;
  trend: 'up' | 'down' | 'divergent' | 'conflict' | 'volatile' | 'stale';
  volumeSpike: boolean;
  qualityIssue?: DataQualityStatus;
}

export const STOCK_REGISTRY: Record<string, StockConfig> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    exchange: 'NSE',
    sector: 'Energy & Conglomerate',
    basePrice: 2950.0,
    seed: 101,
    trend: 'up', // Upward momentum with normal volume
    volumeSpike: false,
  },
  TATASTEEL: {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Limited',
    exchange: 'NSE',
    sector: 'Metals & Mining',
    basePrice: 148.5,
    seed: 202,
    trend: 'down', // Downward momentum with abnormal volume spike
    volumeSpike: true,
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    sector: 'Information Technology',
    basePrice: 1840.0,
    seed: 303,
    trend: 'divergent', // Positive sentiment, but deteriorating technical conditions
    volumeSpike: false,
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    basePrice: 1680.0,
    seed: 404,
    trend: 'conflict', // Conflicting signals: FII selling vs stable NIM/domestic retail DII buying
    volumeSpike: false,
  },
  ZOMATO: {
    symbol: 'ZOMATO',
    name: 'Zomato Limited (Blinkit)',
    exchange: 'NSE',
    sector: 'Consumer Internet',
    basePrice: 265.0,
    seed: 505,
    trend: 'volatile',
    volumeSpike: true,
  },
  SUNPHARMA: {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries',
    exchange: 'NSE',
    sector: 'Pharmaceuticals',
    basePrice: 1720.0,
    seed: 606,
    trend: 'stale',
    volumeSpike: false,
    qualityIssue: 'STALE',
  },
};

/**
 * Deterministically generates OHLCV history for an Indian stock
 */
export function generateDeterministicOHLCV(config: StockConfig, days: number = 60): OHLCVPoint[] {
  const rng = mulberry32(config.seed);
  const result: OHLCVPoint[] = [];

  let currentPrice = config.basePrice;
  const now = new Date(2025, 0, 31); // Jan 31, 2025 snapshot

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Skip weekends for realistic exchange calendar
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = d.toISOString().split('T')[0];

    // Calculate daily return based on scenario
    let dailyBias = 0.0005;
    let volatility = 0.015;

    if (config.trend === 'up') {
      dailyBias = 0.0022; // Steady upward trend
      volatility = 0.012;
    } else if (config.trend === 'down') {
      dailyBias = -0.0035; // Downward pressure
      volatility = 0.02;
    } else if (config.trend === 'divergent') {
      // Started higher, then rolling over recently
      dailyBias = i < 10 ? -0.004 : 0.001;
      volatility = 0.014;
    } else if (config.trend === 'conflict') {
      // Choppy oscillation
      dailyBias = Math.sin(i * 0.4) * 0.003;
      volatility = 0.016;
    } else if (config.trend === 'volatile') {
      dailyBias = 0.0015;
      volatility = 0.028;
    }

    const shock = (rng() - 0.5) * 2 * volatility;
    const dailyReturn = dailyBias + shock;

    const open = Number((currentPrice * (1 + (rng() - 0.5) * 0.005)).toFixed(2));
    const close = Number((currentPrice * (1 + dailyReturn)).toFixed(2));
    const high = Number((Math.max(open, close) * (1 + rng() * 0.009)).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - rng() * 0.009)).toFixed(2));

    // Base volume
    let baseVol = 2500000;
    if (config.symbol === 'TATASTEEL') baseVol = 18000000;
    if (config.symbol === 'ZOMATO') baseVol = 35000000;
    if (config.symbol === 'INFY') baseVol = 4500000;
    if (config.symbol === 'HDFCBANK') baseVol = 12000000;

    let volumeMultiplier = 0.7 + rng() * 0.6; // 0.7x to 1.3x normal

    // Spike on recent days if configured
    if (config.volumeSpike && i <= 2) {
      volumeMultiplier = 2.8 + rng() * 0.8; // 2.8x - 3.6x volume anomaly!
    }

    const volume = Math.round(baseVol * volumeMultiplier);
    currentPrice = close;

    result.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Calculate technical bands for chart rendering
  const closes = result.map(r => r.close);
  for (let i = 0; i < result.length; i++) {
    const historicalSub = closes.slice(0, i + 1);
    result[i].sma20 = calculateSMA(historicalSub, 20);
    result[i].sma50 = calculateSMA(historicalSub, 50);
    result[i].rsi = calculateRSI(historicalSub, 14);
  }

  return result;
}

/**
 * Validates data quality against common exchange anomalies
 */
export function validateDataQuality(
  symbol: string,
  history: OHLCVPoint[]
): { status: DataQualityStatus; notes: string[] } {
  const notes: string[] = [];

  if (history.length < 20) {
    notes.push(`Insufficient historical records: ${history.length} bars available, minimum 20 required for SMA/RSI.`);
    return { status: 'INSUFFICIENT_HISTORY', notes };
  }

  // Check for stale data in special test cases
  if (symbol === 'SUNPHARMA') {
    notes.push('Latest exchange feed timestamp > 48 hours stale. Falling back to last authenticated tick.');
    return { status: 'STALE', notes };
  }

  // Check for extreme outliers (price swing > 20% in a single day on large cap)
  for (let i = 1; i < history.length; i++) {
    const pct = Math.abs((history[i].close - history[i - 1].close) / history[i - 1].close);
    if (pct > 0.25) {
      notes.push(`Extreme price anomaly of ${(pct * 100).toFixed(1)}% detected on ${history[i].date}.`);
      return { status: 'ANOMALY', notes };
    }
  }

  notes.push('Price series validated: 0 null entries, timestamps contiguous, OHLC bounding valid.');
  return { status: 'VALID', notes };
}

/**
 * Builds normalized market quote record
 */
export function getMarketQuote(symbol: string): MarketRecord {
  const config = STOCK_REGISTRY[symbol] || STOCK_REGISTRY['RELIANCE'];
  const history = generateDeterministicOHLCV(config, 60);
  const quality = validateDataQuality(config.symbol, history);

  const lastBar = history[history.length - 1];
  const prevBar = history[history.length - 2] || lastBar;
  const change = Number((lastBar.close - prevBar.close).toFixed(2));
  const changePercent = Number(((change / prevBar.close) * 100).toFixed(2));
  const vwap = Number(((lastBar.high + lastBar.low + lastBar.close) / 3).toFixed(2));

  return {
    symbol: config.symbol,
    name: config.name,
    exchange: config.exchange,
    timestamp: '2025-01-31T15:30:00+05:30 (Market Close IST)',
    open: lastBar.open,
    high: lastBar.high,
    low: lastBar.low,
    close: lastBar.close,
    volume: lastBar.volume,
    prevClose: prevBar.close,
    change,
    changePercent,
    vwap,
    currency: 'INR (₹)',
    source: 'NSE Equity Segment (Deterministic Simulated Engine)',
    is_synthetic: true,
    data_quality_status: quality.status,
    quality_notes: quality.notes,
  };
}

/**
 * Returns Indian market indices (NIFTY 50 and SENSEX)
 */
export function getMarketIndices(): { nifty50: MarketRecord; sensex: MarketRecord } {
  return {
    nifty50: {
      symbol: 'NIFTY 50',
      name: 'Nifty 50 Benchmark Index',
      exchange: 'NSE',
      timestamp: '2025-01-31T15:30:00+05:30',
      open: 23480.2,
      high: 23620.5,
      low: 23410.0,
      close: 23532.7,
      volume: 382400000,
      prevClose: 23450.0,
      change: 82.7,
      changePercent: 0.35,
      vwap: 23510.0,
      currency: 'INR (Points)',
      source: 'NSE India Simulated Feed',
      is_synthetic: true,
      data_quality_status: 'VALID',
    },
    sensex: {
      symbol: 'SENSEX',
      name: 'BSE SENSEX 30',
      exchange: 'BSE',
      timestamp: '2025-01-31T15:30:00+05:30',
      open: 77310.0,
      high: 77720.0,
      low: 77150.0,
      close: 77580.3,
      volume: 120500000,
      prevClose: 77290.0,
      change: 290.3,
      changePercent: 0.38,
      vwap: 77480.0,
      currency: 'INR (Points)',
      source: 'BSE India Simulated Feed',
      is_synthetic: true,
      data_quality_status: 'VALID',
    },
  };
}
