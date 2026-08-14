import {
  PRODUCTS,
  CREDIT_SCORE_MULTIPLIERS,
  TIME_IN_BUSINESS_MULTIPLIERS,
  INDUSTRY_MULTIPLIERS,
  type TimeInBusiness,
} from './calculator-config';

export type { TimeInBusiness };

export interface CalculatorInputs {
  monthlyRevenue: number;
  creditScore: number;
  industry: string;
  timeInBusiness: TimeInBusiness;
}

export interface ProductOffer {
  id: string;
  name: string;
  amount: number;
  termMonths: number;
  factorRate: number;
  costOfCapital: string;
  applyUrl: string;
}

export interface OfferResult {
  declined: false;
  maxFunding: number;
  products: ProductOffer[];
}

export interface DeclineResult {
  declined: true;
  declineMessage: string;
}

export type CalculatorResult = OfferResult | DeclineResult;

const DECLINE_RULES: Array<(inputs: CalculatorInputs) => string | false> = [
  inputs => inputs.industry === 'nonprofit' && 'Your industry does not qualify for funding at this time.',
  inputs => ['0-6-months', '6-11-months'].includes(inputs.timeInBusiness) && 'Most of our funding products require at least 12 months in business. As your business grows, come back and check again.',
  inputs => inputs.creditScore < 580 && 'A minimum credit score of 580 is required to qualify for funding.',
  inputs => inputs.monthlyRevenue < 40000 && 'A minimum monthly revenue of $40,000 is required to qualify for funding.',
];

// TODO: SERVER_SIDE, to migrate to an API route:
//   1. Move this function into src/pages/api/calculate.ts
//   2. Accept CalculatorInputs as POST body JSON, return CalculatorResult as JSON
//   3. In Calculator.astro replace the direct call with:
//      const result: CalculatorResult = await fetch('/api/calculate', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify(inputs),
//      }).then(r => r.json());
export function calculate(inputs: CalculatorInputs): CalculatorResult {
  for (const rule of DECLINE_RULES) {
    const message = rule(inputs);
    if (message) return { declined: true, declineMessage: message };
  }

  const creditMod =
    CREDIT_SCORE_MULTIPLIERS.find(
      r => inputs.creditScore >= r.min && inputs.creditScore <= r.max
    )?.multiplier ?? 1.0;

  const industryMod =
    INDUSTRY_MULTIPLIERS[inputs.industry] ?? INDUSTRY_MULTIPLIERS['default'];

  const timeMod = TIME_IN_BUSINESS_MULTIPLIERS[inputs.timeInBusiness];

  const combinedMod = creditMod * industryMod * timeMod;

  const products: ProductOffer[] = PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    amount: Math.round(inputs.monthlyRevenue * p.revenueMultiplier * combinedMod),
    termMonths: p.termMonths,
    factorRate: p.factorRate,
    costOfCapital: p.costOfCapital,
    applyUrl: p.applyUrl,
  }));

  const maxFunding = Math.max(...products.map(p => p.amount));

  return { declined: false, maxFunding, products };
}
