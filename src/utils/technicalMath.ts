import { TechnicalIndicators, VolumeMetrics, DataQualityStatus, OHLCVPoint } from '../types';

/**
 * Calculates Simple Moving Average (SMA) over period n.
 */
export function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1] : 0;
  const slice = data.slice(data.length - period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

/**
 * Calculates Relative Strength Index (RSI) using Wilder's 14-period smoothing.
 */
export function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50.0;

  const changes: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  let gains = 0;
  let losses = 0;

  // First period average
  for (let i = 0; i < period; i++) {
    const diff = changes[i];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder's smoothing for subsequent periods
  for (let i = period; i < changes.length; i++) {
    const diff = changes[i];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100.0;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return Number(rsi.toFixed(2));
}

/**
 * Calculates 20-day annualized historical volatility using log returns.
 */
export function calculateVolatility(closes: number[], period: number = 20): number {
  if (closes.length < period + 1) return 0.18; // Default Indian equity benchmark ~18%

  const slice = closes.slice(closes.length - (period + 1));
  const logReturns: number[] = [];
  for (let i = 1; i < slice.length; i++) {
    logReturns.push(Math.log(slice[i] / slice[i - 1]));
  }

  const mean = logReturns.reduce((acc, v) => acc + v, 0) / logReturns.length;
  const variance = logReturns.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (logReturns.length - 1);
  const dailyStd = Math.sqrt(variance);
  const annualized = dailyStd * Math.sqrt(252) * 100; // In percent
  return Number(annualized.toFixed(2));
}

/**
 * Computes return over specified lookback window.
 */
export function calculateReturn(closes: number[], lookbackBars: number): number {
  if (closes.length <= lookbackBars) return 0;
  const current = closes[closes.length - 1];
  const previous = closes[closes.length - 1 - lookbackBars];
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

/**
 * Computes volume anomaly metrics and z-scores against rolling 20-day baseline.
 */
export function computeVolumeMetrics(symbol: string, volumes: number[], closes: number[]): VolumeMetrics {
  const currentVolume = volumes[volumes.length - 1] || 0;
  const baselinePeriod = 20;

  if (volumes.length < 5) {
    return {
      symbol,
      currentVolume,
      baselineVolume20d: currentVolume,
      volumeRatio: 1.0,
      zScore: 0,
      isAnomaly: false,
      divergenceDetected: false,
      divergenceType: 'NEUTRAL',
      outlierStatus: false,
    };
  }

  const lookbackSlice = volumes.slice(Math.max(0, volumes.length - baselinePeriod - 1), volumes.length - 1);
  const mean = lookbackSlice.reduce((acc, v) => acc + v, 0) / lookbackSlice.length;
  const variance = lookbackSlice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(1, lookbackSlice.length - 1);
  const std = Math.sqrt(variance);

  const zScore = std > 0 ? Number(((currentVolume - mean) / std).toFixed(2)) : 0;
  const volumeRatio = mean > 0 ? Number((currentVolume / mean).toFixed(2)) : 1.0;
  const isAnomaly = zScore > 2.0 || volumeRatio > 2.2;
  const outlierStatus = zScore > 3.5;

  // Check volume-price divergence:
  // e.g. price fell while volume exploded (distribution/selling climax) or price rose on declining volume
  const priceChange = closes.length >= 2 ? closes[closes.length - 1] - closes[closes.length - 2] : 0;
  let divergenceDetected = false;
  let divergenceType: VolumeMetrics['divergenceType'] = 'NEUTRAL';

  if (priceChange > 0 && volumeRatio < 0.65) {
    divergenceDetected = true;
    divergenceType = 'BEARISH_DIVERGENCE'; // Price up on weak volume
  } else if (priceChange < 0 && volumeRatio > 2.2) {
    divergenceDetected = true;
    divergenceType = 'BULLISH_DIVERGENCE'; // Potential selling climax or absorption
  } else if (priceChange > 0 && volumeRatio > 1.5) {
    divergenceType = 'CONFIRMING'; // Strong volume confirms price rise
  }

  return {
    symbol,
    currentVolume,
    baselineVolume20d: Math.round(mean),
    volumeRatio,
    zScore,
    isAnomaly,
    divergenceDetected,
    divergenceType,
    outlierStatus,
  };
}

/**
 * Computes complete technical indicators from historical OHLCV.
 */
export function computeTechnicalIndicators(
  symbol: string,
  history: OHLCVPoint[],
  quality: DataQualityStatus
): TechnicalIndicators {
  const closes = history.map(h => h.close);
  const highs = history.map(h => h.high);
  const lows = history.map(h => h.low);

  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const rsi14 = calculateRSI(closes, 14);
  const volatility20d = calculateVolatility(closes, 20);

  const return1d = calculateReturn(closes, 1);
  const return5d = calculateReturn(closes, 5);
  const return20d = calculateReturn(closes, 20);

  const high52w = Math.max(...highs);
  const low52w = Math.min(...lows);

  const currentClose = closes[closes.length - 1];
  let trendDirection: TechnicalIndicators['trendDirection'] = 'NEUTRAL';

  if (currentClose > sma20 && sma20 > sma50) {
    trendDirection = 'BULLISH';
  } else if (currentClose < sma20 && sma20 < sma50) {
    trendDirection = 'BEARISH';
  }

  // Breakout detection (20-day high/low break)
  const prior20Highs = highs.slice(Math.max(0, highs.length - 21), highs.length - 1);
  const prior20Lows = lows.slice(Math.max(0, lows.length - 21), lows.length - 1);
  const max20High = prior20Highs.length > 0 ? Math.max(...prior20Highs) : currentClose;
  const min20Low = prior20Lows.length > 0 ? Math.min(...prior20Lows) : currentClose;

  let isBreakout = false;
  let breakoutType: TechnicalIndicators['breakoutType'] = 'NONE';

  if (currentClose > max20High) {
    isBreakout = true;
    breakoutType = 'UPWARD_BREAKOUT';
  } else if (currentClose < min20Low) {
    isBreakout = true;
    breakoutType = 'DOWNWARD_BREAKDOWN';
  }

  return {
    symbol,
    sma20,
    sma50,
    rsi14,
    volatility20d,
    return1d,
    return5d,
    return20d,
    high52w: Number(high52w.toFixed(2)),
    low52w: Number(low52w.toFixed(2)),
    trendDirection,
    isBreakout,
    breakoutType,
    dataQuality: quality,
  };
}
