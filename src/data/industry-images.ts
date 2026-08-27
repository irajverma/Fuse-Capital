import heroConstruction from '@/assets/hero-construction.jpg';
import heroLandscaping from '@/assets/hero-landscaping.jpg';
import heroHvac from '@/assets/hero-hvac.jpg';
import heroElectrical from '@/assets/hero-electrical.jpg';
import heroCleaning from '@/assets/hero-cleaning.jpg';
import heroRoofing from '@/assets/hero-roofing.jpg';

import heroFood from '@/assets/hero-food.jpg';
import heroBars from '@/assets/hero-bars.jpg';
import heroHotels from '@/assets/hero-hotels.jpg';
import heroCatering from '@/assets/hero-catering.jpg';
import heroCafes from '@/assets/hero-cafes.jpg';

import heroRetail from '@/assets/clothes-showroom-brutalist.webp';
import heroEcommerce from '@/assets/hero-ecommerce.jpg';
import heroConvenience from '@/assets/hero-convenience.jpg';
import heroGrocery from '@/assets/hero-grocery.jpg';
import heroAutoDealers from '@/assets/hero-autodealers.jpg';

import heroHealthcare from '@/assets/hero-healthcare.jpg';
import heroDental from '@/assets/hero-dental.jpg';
import heroBeauty from '@/assets/hero-beauty.jpg';
import heroGyms from '@/assets/hero-gyms.jpg';
import heroVeterinary from '@/assets/hero-veterinary.jpg';

import heroTransport from '@/assets/hero-transport.jpg';
import heroAutoRepair from '@/assets/hero-autorepair.jpg';
import heroFreight from '@/assets/hero-freight.jpg';
import heroGasStations from '@/assets/hero-gasstations.jpg';

import heroLaw from '@/assets/hero-law.jpg';
import heroAccounting from '@/assets/hero-accounting.jpg';
import heroRealEstate from '@/assets/building.png';
import heroStaffing from '@/assets/hero-staffing.jpg';
import heroMarketing from '@/assets/hero-marketing.jpg';
import heroDefault from '@/assets/industries-hero.jpg';

const slugImageMap: Record<string, ImageMetadata> = {
  // Trades (Construction & Trades)
  construction: heroConstruction,
  trades: heroConstruction,
  landscaping: heroLandscaping,
  'hvac-plumbing': heroHvac,
  electrical: heroElectrical,
  cleaning: heroCleaning,
  'cleaning-janitorial': heroCleaning,
  roofing: heroRoofing,

  // Food & Hospitality
  restaurants: heroFood,
  food: heroFood,
  'bars-nightlife': heroBars,
  'hotels-lodging': heroHotels,
  'catering-events': heroCatering,
  'cafes-bakeries': heroCafes,

  // Retail & E-Commerce
  'retail-stores': heroRetail,
  retail: heroRetail,
  'e-commerce': heroEcommerce,
  'liquor-convenience': heroConvenience,
  'grocery-markets': heroGrocery,
  'auto-dealers': heroAutoDealers,

  // Health & Wellness
  'healthcare-medical': heroHealthcare,
  health: heroHealthcare,
  'hospitality-healthcare': heroHealthcare,
  dental: heroDental,
  'beauty-salons': heroBeauty,
  'fitness-gyms': heroGyms,
  veterinary: heroVeterinary,

  // Transportation & Logistics
  trucking: heroTransport,
  transport: heroTransport,
  'logistics-transportation': heroTransport,
  'auto-repair': heroAutoRepair,
  'freight-logistics': heroFreight,
  'gas-stations': heroGasStations,

  // Professional Services
  'law-firms': heroLaw,
  pro: heroLaw,
  accounting: heroAccounting,
  'real-estate': heroRealEstate,
  'staffing-recruiting': heroStaffing,
  'marketing-agencies': heroMarketing,
};

const categoryImageMap: Record<string, ImageMetadata> = {
  trades: heroConstruction,
  transport: heroTransport,
  health: heroHealthcare,
  food: heroFood,
  retail: heroRetail,
  pro: heroLaw,
};

export function getIndustryImage(slug?: string, categoryKey?: string): ImageMetadata {
  if (slug && slugImageMap[slug]) {
    return slugImageMap[slug];
  }
  if (categoryKey && categoryImageMap[categoryKey]) {
    return categoryImageMap[categoryKey];
  }
  return heroDefault;
}
