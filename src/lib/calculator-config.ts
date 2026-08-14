export type TimeInBusiness = '0-6-months' | '6-11-months' | '1-3-years' | '3-plus-years';

export interface ProductConfig {
  id: string;
  name: string;
  revenueMultiplier: number;
  termMonths: number;
  factorRate: number;
  costOfCapital: string;
  applyUrl: string;
}

// Multipliers are the share of monthly revenue shown as the public teaser estimate. The
// underwriting engine caps every real deal at 90% of average monthly revenue (and further
// by repayment capacity); these sit at or below 0.9 so the calculator never promises more
// than the engine could ever offer.
export const PRODUCTS: ProductConfig[] = [
  {
    id: 'line-of-credit',
    name: 'Line of Credit',
    revenueMultiplier: 0.5,
    termMonths: 12,
    factorRate: 1.48,
    costOfCapital: 'Varies',
    applyUrl: '/apply?product=loc',
  },
  {
    id: 'term-loan',
    name: 'Term Loan',
    revenueMultiplier: 0.25,
    termMonths: 18,
    factorRate: 1.25,
    costOfCapital: 'Varies',
    applyUrl: '/apply?product=term-loan',
  },
  {
    id: 'mca',
    name: 'Merchant Cash Advance',
    revenueMultiplier: 0.9,
    termMonths: 15,
    factorRate: 1.37,
    costOfCapital: 'Varies',
    applyUrl: '/apply?product=mca',
  },
];

export const CREDIT_SCORE_MULTIPLIERS: { min: number; max: number; multiplier: number }[] = [
  { min: 300, max: 579, multiplier: 0.5  },
  { min: 580, max: 669, multiplier: 0.75 },
  { min: 670, max: 739, multiplier: 0.9  },
  { min: 740, max: 850, multiplier: 1.0  },
];

export const TIME_IN_BUSINESS_MULTIPLIERS: Record<TimeInBusiness, number> = {
  '0-6-months':   0.5,
  '6-11-months':  0.7,
  '1-3-years':    0.9,
  '3-plus-years': 1.0,
};

// Industries with non-default risk multipliers
export const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  default: 1.0,
  // Examples. Uncomment and adjust as needed:
  // 'gambling': 0.5,
  // 'cannabis': 0.6,
};
