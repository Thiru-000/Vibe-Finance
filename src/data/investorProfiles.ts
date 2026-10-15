import { InvestorProfile } from '../types';

export const DEFAULT_INVESTOR_PROFILES: InvestorProfile[] = [
  {
    id: 'profile_conservative',
    name: 'Ramesh Mehta',
    alias: 'Conservative Wealth Preserver',
    avatar_bg: 'bg-emerald-950/70 border-emerald-700/50 text-emerald-400',
    risk_tolerance: 'Conservative',
    time_horizon: 'Long-Term (3Y+)',
    cash_allocation_pct: 25.0,
    max_single_position_pct: 12.0,
    investment_objectives: [
      'Capital Preservation & Inflation Hedge',
      'Consistent Dividend Yield (> 1.8%)',
      'Low Portfolio Beta (< 0.85)',
      'Blue-chip large cap bias only'
    ],
    sector_exposure: {
      'Banking & Financial Services': 28.5,
      'Energy & Retail Conglomerate': 24.0,
      'Information Technology': 17.5,
      'Pharmaceuticals': 5.0,
      'Cash & Liquid Debt': 25.0
    },
    holdings: [
      {
        symbol: 'RELIANCE',
        company_name: 'Reliance Industries Limited',
        sector: 'Energy & Retail Conglomerate',
        quantity: 250,
        avg_price: 1120.0,
        current_price: 1175.0
      },
      {
        symbol: 'HDFCBANK',
        company_name: 'HDFC Bank Limited',
        sector: 'Banking & Financial Services',
        quantity: 220,
        avg_price: 1610.0,
        current_price: 1690.0
      },
      {
        symbol: 'TCS',
        company_name: 'Tata Consultancy Services',
        sector: 'Information Technology',
        quantity: 60,
        avg_price: 3750.0,
        current_price: 3850.0
      }
    ],
    watchlist: ['INFY', 'SUNPHARMA', 'ITC', 'ICICIBANK'],
    behavioral_notes: 'Strong aversion to cyclical commodities and negative operating earnings. Highly disciplined against drawdown exceeding 8%.'
  },
  {
    id: 'profile_balanced',
    name: 'Priya Sharma',
    alias: 'Balanced Equity Growth Mandate',
    avatar_bg: 'bg-cyan-950/70 border-cyan-700/50 text-cyan-400',
    risk_tolerance: 'Moderate',
    time_horizon: 'Medium-Term (6M-3Y)',
    cash_allocation_pct: 15.0,
    max_single_position_pct: 18.0,
    investment_objectives: [
      'Capital Appreciation with Downside Cushion',
      'Systematic Diversification Across 5+ Core Sectors',
      'Quality & Earnings Visibility Strategy',
      'Tactical Rebalancing on Valuations'
    ],
    sector_exposure: {
      'Banking & Financial Services': 25.0,
      'Information Technology': 22.0,
      'Energy & Retail Conglomerate': 18.0,
      'Consumer Internet': 8.0,
      'Metals & Mining': 12.0,
      'Cash & Liquid Debt': 15.0
    },
    holdings: [
      {
        symbol: 'INFY',
        company_name: 'Infosys Limited',
        sector: 'Information Technology',
        quantity: 150,
        avg_price: 1740.0,
        current_price: 1820.0
      },
      {
        symbol: 'HDFCBANK',
        company_name: 'HDFC Bank Limited',
        sector: 'Banking & Financial Services',
        quantity: 180,
        avg_price: 1640.0,
        current_price: 1690.0
      },
      {
        symbol: 'TATASTEEL',
        company_name: 'Tata Steel Limited',
        sector: 'Metals & Mining',
        quantity: 1200,
        avg_price: 142.0,
        current_price: 148.2
      },
      {
        symbol: 'RELIANCE',
        company_name: 'Reliance Industries Limited',
        sector: 'Energy & Retail Conglomerate',
        quantity: 180,
        avg_price: 1140.0,
        current_price: 1175.0
      }
    ],
    watchlist: ['ZOMATO', 'TCS', 'TATAMOTORS', 'BHARTIARTL'],
    behavioral_notes: 'Willing to absorb intermediate volatility if fundamental ROCE and cash flow thesis remains intact.'
  },
  {
    id: 'profile_growth',
    name: 'Arjun Verma',
    alias: 'High-Beta Momentum & Growth Mandate',
    avatar_bg: 'bg-amber-950/70 border-amber-700/50 text-amber-400',
    risk_tolerance: 'Aggressive',
    time_horizon: 'Short-Term (< 6M)',
    cash_allocation_pct: 8.0,
    max_single_position_pct: 30.0,
    investment_objectives: [
      'Maximum Total Return & Momentum Capture',
      'High-Beta Growth & Quick-Commerce Leadership',
      'Earnings Inflection & Operating Leverage Plays',
      'Digital Economy Platforms'
    ],
    sector_exposure: {
      'Consumer Internet': 35.0,
      'Information Technology': 25.0,
      'Metals & Mining': 18.0,
      'Automobile': 14.0,
      'Cash & Liquid Debt': 8.0
    },
    holdings: [
      {
        symbol: 'ZOMATO',
        company_name: 'Zomato Limited (Blinkit)',
        sector: 'Consumer Internet',
        quantity: 3500,
        avg_price: 215.0,
        current_price: 265.0
      },
      {
        symbol: 'INFY',
        company_name: 'Infosys Limited',
        sector: 'Information Technology',
        quantity: 120,
        avg_price: 1780.0,
        current_price: 1820.0
      },
      {
        symbol: 'TATAMOTORS',
        company_name: 'Tata Motors Limited',
        sector: 'Automobile',
        quantity: 300,
        avg_price: 840.0,
        current_price: 875.0
      }
    ],
    watchlist: ['RELIANCE', 'TATASTEEL', 'HDFCBANK', 'BHARTIARTL'],
    behavioral_notes: 'High tolerance for 20%+ drawdown in pursuit of capital appreciation. Focused on volume breakouts and operating leverage.'
  }
];

const LOCAL_STORAGE_KEY = 'vibefinance_investor_profiles';

export function getSavedProfiles(): InvestorProfile[] {
  if (typeof window === 'undefined') return DEFAULT_INVESTOR_PROFILES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INVESTOR_PROFILES));
      return DEFAULT_INVESTOR_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INVESTOR_PROFILES;
  } catch {
    return DEFAULT_INVESTOR_PROFILES;
  }
}

export function saveProfiles(profiles: InvestorProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to localStorage', err);
  }
}

/**
 * Computes portfolio metrics for an investor profile using live prices when available
 */
export function computePortfolioMetrics(profile: InvestorProfile, livePrices?: Record<string, number>) {
  let investedTotal = 0;
  let currentTotal = 0;

  for (const h of profile.holdings) {
    const livePrice = livePrices?.[h.symbol] ?? h.current_price;
    investedTotal += h.quantity * h.avg_price;
    currentTotal += h.quantity * livePrice;
  }

  // Cash computation
  const cashAmount = (currentTotal / (1 - (profile.cash_allocation_pct / 100))) * (profile.cash_allocation_pct / 100);
  const totalPortfolioValue = currentTotal + cashAmount;

  const unrealizedPnL = currentTotal - investedTotal;
  const unrealizedPnLPct = investedTotal > 0 ? (unrealizedPnL / investedTotal) * 100 : 0;

  // Concentration calculations
  const holdingWeights = profile.holdings.map(h => {
    const livePrice = livePrices?.[h.symbol] ?? h.current_price;
    const val = h.quantity * livePrice;
    const weight = totalPortfolioValue > 0 ? (val / totalPortfolioValue) * 100 : 0;
    return {
      symbol: h.symbol,
      value: Math.round(val),
      price: livePrice,
      weight: Number(weight.toFixed(1)),
      isOverConcentrated: weight > profile.max_single_position_pct
    };
  });

  // Herfindahl-Hirschman Index (HHI) for concentration score (0-100)
  const hhi = holdingWeights.reduce((acc, h) => acc + Math.pow(h.weight, 2), 0) / 100;
  const concentrationScore = Math.min(100, Math.round(hhi));

  return {
    totalPortfolioValue: Math.round(totalPortfolioValue),
    investedTotal: Math.round(investedTotal),
    currentEquityTotal: Math.round(currentTotal),
    cashAmount: Math.round(cashAmount),
    unrealizedPnL: Math.round(unrealizedPnL),
    unrealizedPnLPct: Number(unrealizedPnLPct.toFixed(2)),
    holdingWeights,
    concentrationScore,
    isAnyOverConcentrated: holdingWeights.some(h => h.isOverConcentrated),
  };
}
