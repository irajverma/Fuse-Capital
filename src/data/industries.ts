export type Industry = {
  name: string;
  slug: string;
  paths: string[];
  circles?: { cx: number; cy: number; r: number }[];
  rect?: { x: number; y: number; w: number; h: number; rx: number };
};

export type IndustryCategoryColor = 'orange' | 'rose' | 'violet' | 'emerald' | 'blue' | 'indigo';

export type IndustryCategory = {
  key: string;
  label: string;
  color: IndustryCategoryColor;
  items: Industry[];
};

export const industryCategories: IndustryCategory[] = [
  {
    key: 'trades',
    label: 'Construction & Trades',
    color: 'orange',
    items: [
      { name: 'Construction', slug: 'construction', paths: ['M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z', 'M10 10V6a2 2 0 0 1 4 0v4', 'M4 15a8 8 0 0 1 16 0'] },
      { name: 'Landscaping', slug: 'landscaping', paths: ['M12 2 6 11h12z', 'M12 8l-4 7h8z', 'M12 15v7'] },
      { name: 'HVAC & Plumbing', slug: 'hvac-plumbing', paths: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'] },
      { name: 'Electrical', slug: 'electrical', paths: ['M13 2 3 14h9l-1 8 10-12h-9z'] },
      { name: 'Cleaning & Janitorial', slug: 'cleaning-janitorial', paths: ['M12 3 13.9 8.1 19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', 'M19 15l.6 1.6 1.6.6-1.6.6L19 20l-.6-1.6L16.8 17.8 18.4 17.2z'] },
      { name: 'Roofing', slug: 'roofing', paths: ['M2 12 12 4l10 8', 'M5 10v9h14v-9', 'M9 19v-5h6v5'] },
    ],
  },
  {
    key: 'food',
    label: 'Food & Hospitality',
    color: 'rose',
    items: [
      { name: 'Restaurants', slug: 'restaurants', paths: ['M4 3v7a2 2 0 0 0 4 0V3', 'M6 10v11', 'M16 3c-1.5 0-2.5 1.6-2.5 4s1 4 2.5 4v10'] },
      { name: 'Bars & Nightlife', slug: 'bars-nightlife', paths: ['M5 4h14l-7 8z', 'M12 12v7', 'M8 19h8'] },
      { name: 'Hotels & Lodging', slug: 'hotels-lodging', paths: ['M3 8v12', 'M3 14h18', 'M21 20v-6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2', 'M7 12V9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3'] },
      { name: 'Catering & Events', slug: 'catering-events', paths: ['M6 13a4 4 0 1 1 1.2-7.8 4 4 0 0 1 7.6 0A4 4 0 1 1 18 13z', 'M6 13v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6'] },
      { name: 'Cafés & Bakeries', slug: 'cafes-bakeries', paths: ['M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z', 'M16 9h2a2 2 0 0 1 0 4h-2', 'M5 21h12'] },
    ],
  },
  {
    key: 'retail',
    label: 'Retail & E-commerce',
    color: 'violet',
    items: [
      { name: 'Retail Stores', slug: 'retail-stores', paths: ['M5 7h14l-1 13H6z', 'M9 7a3 3 0 0 1 6 0'] },
      { name: 'E-commerce', slug: 'e-commerce', paths: ['M2 3h2l2.4 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H5'], circles: [{ cx: 9, cy: 20, r: 1.2 }, { cx: 18, cy: 20, r: 1.2 }] },
      { name: 'Liquor & Convenience', slug: 'liquor-convenience', paths: ['M10 3h4v3l1.2 2.4V20a1 1 0 0 1-1 1h-4.4a1 1 0 0 1-1-1V8.4L10 6z', 'M8.8 12h6.4'] },
      { name: 'Grocery & Markets', slug: 'grocery-markets', paths: ['M3 9l1.5-5h15L21 9', 'M4 9v11h16V9', 'M3 9h18'] },
      { name: 'Auto Dealers', slug: 'auto-dealers', paths: ['M5 13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13', 'M4 13h16v4H4z'], circles: [{ cx: 8, cy: 17.5, r: 1.1 }, { cx: 16, cy: 17.5, r: 1.1 }] },
    ],
  },
  {
    key: 'health',
    label: 'Health & Wellness',
    color: 'emerald',
    items: [
      { name: 'Healthcare & Medical', slug: 'healthcare-medical', paths: ['M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z', 'M3.5 12h3l1.5-3 2 5 1.5-3h3'] },
      { name: 'Dental', slug: 'dental', paths: ['M12 5.5c-2-1.8-5-1.4-6 .6-1.1 2.3 0 5.8 1 8.7.5 1.5.9 3.2 2 3.2s1-2 1.5-3.4c.2-.7.6-1 1.5-1s1.3.3 1.5 1c.5 1.4.5 3.4 1.5 3.4s1.5-1.7 2-3.2c1-2.9 2.1-6.4 1-8.7-1-2-4-2.4-6-.6z'] },
      { name: 'Beauty & Salons', slug: 'beauty-salons', paths: ['M8 8l12 8', 'M8 16l12-8'], circles: [{ cx: 6, cy: 6, r: 2.5 }, { cx: 6, cy: 18, r: 2.5 }] },
      { name: 'Fitness & Gyms', slug: 'fitness-gyms', paths: ['M6 7v10', 'M3 9v6', 'M18 7v10', 'M21 9v6', 'M6 12h12'] },
      { name: 'Veterinary', slug: 'veterinary', paths: ['M12 12c-2.5 0-4.5 2-4.5 4 0 1.5 1 2.5 2.5 2.5.8 0 1.3-.4 2-.4s1.2.4 2 .4c1.5 0 2.5-1 2.5-2.5 0-2-2-4-4.5-4z'], circles: [{ cx: 7, cy: 9, r: 1.6 }, { cx: 12, cy: 7, r: 1.6 }, { cx: 17, cy: 9, r: 1.6 }] },
    ],
  },
  {
    key: 'transport',
    label: 'Transportation & Logistics',
    color: 'blue',
    items: [
      { name: 'Trucking', slug: 'trucking', paths: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z'], circles: [{ cx: 7, cy: 18, r: 1.5 }, { cx: 17, cy: 18, r: 1.5 }] },
      { name: 'Auto Repair', slug: 'auto-repair', paths: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'] },
      { name: 'Freight & Logistics', slug: 'freight-logistics', paths: ['M12 3 21 7.5v9L12 21 3 16.5v-9z', 'M3 7.5 12 12l9-4.5', 'M12 12v9'] },
      { name: 'Gas Stations', slug: 'gas-stations', paths: ['M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15', 'M3 20h12', 'M5 11h8', 'M14 8l3 3v6a1.5 1.5 0 0 0 3 0v-7l-3-3'] },
    ],
  },
  {
    key: 'pro',
    label: 'Professional Services',
    color: 'indigo',
    items: [
      { name: 'Law Firms', slug: 'law-firms', paths: ['M12 3v18', 'M7 21h10', 'M5 7h14', 'M5 7 3 12a3 3 0 0 0 4 0z', 'M19 7l2 5a3 3 0 0 1-4 0z'] },
      { name: 'Accounting', slug: 'accounting', paths: ['M8 7h8', 'M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01'], rect: { x: 5, y: 3, w: 14, h: 18, rx: 2 } },
      { name: 'Real Estate', slug: 'real-estate', paths: ['M2 12 12 4l10 8', 'M5 10v9h14v-9', 'M9 19v-5h6v5'] },
      { name: 'Staffing & Recruiting', slug: 'staffing-recruiting', paths: ['M3 20a6 6 0 0 1 12 0', 'M16 5.5a3 3 0 0 1 0 5', 'M18.5 14a6 6 0 0 1 2.5 6'], circles: [{ cx: 9, cy: 8, r: 3 }] },
      { name: 'Marketing Agencies', slug: 'marketing-agencies', paths: ['M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z', 'M16 9a3 3 0 0 1 0 6'] },
    ],
  },
];

export const industryNames: string[] = [
  ...industryCategories.flatMap(c => c.items.map(i => i.name)),
  'Other',
]

export const categoryDotColor: Record<IndustryCategoryColor, string> = {
  orange: 'bg-orange-500',
  rose: 'bg-rose-600',
  violet: 'bg-violet-600',
  emerald: 'bg-emerald-600',
  blue: 'bg-blue-600',
  indigo: 'bg-indigo-600',
};

export const categoryBannerColor: Record<IndustryCategoryColor, string> = {
  orange: 'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30',
  rose: 'from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30',
  violet: 'from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30',
  emerald: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30',
  blue: 'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30',
  indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/30',
};

export const categoryIconColor: Record<IndustryCategoryColor, string> = {
  orange: 'text-orange-600',
  rose: 'text-rose-600',
  violet: 'text-violet-600',
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
};
