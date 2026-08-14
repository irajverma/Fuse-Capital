// Single source of truth for the "How much capital do you need?" options.
// Shared by the home page hero dropdown and the application form (Step 1), so a
// selection on the home page maps cleanly onto the form field that prefills it.

export type FundingAmount = {
  /** Stable value persisted to localStorage + D1. Never change once shipped. */
  value: string
  label: string
}

export const fundingAmounts: FundingAmount[] = [
  { value: '1-5k', label: '$1 – $5K' },
  { value: '5-25k', label: '$5K – $25K' },
  { value: '25-50k', label: '$25K – $50K' },
  { value: '50-100k', label: '$50K – $100K' },
  { value: '100-250k', label: '$100K – $250K' },
  { value: '250-500k', label: '$250K – $500K' },
  { value: '500k-1m', label: '$500K – $1M' },
  { value: '1m-plus', label: '$1M+' },
]

export const fundingAmountLabels: Record<string, string> = Object.fromEntries(
  fundingAmounts.map((f) => [f.value, f.label]),
)
