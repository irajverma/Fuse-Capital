export type IndustryDetail = {
  heroTagline: string;
  heroHeadline: string;
  heroDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  benefitsTitle: string;
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

export const industryDetailsMap: Record<string, Partial<IndustryDetail>> = {
  'hospitality-healthcare': {
    heroTagline: 'Hospitality & Healthcare Funding',
    heroHeadline: 'Hospitality & Healthcare choose Funded Experts.',
    heroDescription:
      'Hospitality and healthcare operations depend on constant cash flow for staffing, specialized equipment, and facility maintenance. We deliver fast, flexible working capital so you can maintain exceptional patient and guest care.',
    stat1Value: '24h',
    stat1Label: 'average turnaround time',
    stat2Value: '4.8/5',
    stat2Label: 'client rating score',
    stat3Value: '$24M+',
    stat3Label: 'in hospitality & healthcare funding',
    stat4Value: '3,200+',
    stat4Label: 'practices & venues funded',
    benefitsTitle: 'How we support hospitality & healthcare businesses',
    benefits: [
      {
        title: 'Bridge insurance reimbursement delays',
        description: 'Healthcare practices often wait 60–90 days for insurance payouts. Get immediate capital to keep operations smooth.',
      },
      {
        title: 'Upgrade specialized medical & kitchen equipment',
        description: 'Acquire new diagnostic tools, dental chairs, or commercial kitchen suites with easy repayment terms.',
      },
      {
        title: 'Cover seasonal spikes & staffing payroll',
        description: 'Scale staff for peak holiday seasons, conventions, or expanding patient volumes risk-free.',
      },
      {
        title: 'No impact on credit score to apply',
        description: 'Checking qualification requires zero hard credit pulls and provides decision offers within hours.',
      },
    ],
    faqs: [
      {
        question: 'Can healthcare practices qualify with delayed insurance payouts?',
        answer: 'Yes! Our revenue-based funding evaluates overall bank deposit volume rather than waiting for insurance claims to settle.',
      },
      {
        question: 'What hospitality businesses qualify for financing?',
        answer: 'Hotels, motels, restaurants, bars, event venues, catering companies, and bed & breakfasts with $10,000+ in monthly revenue qualify.',
      },
      {
        question: 'How fast can funds be deposited into our business bank account?',
        answer: 'Approvals take minutes, and capital is deposited in as little as 24 hours after approval.',
      },
    ],
  },
  'logistics-transportation': {
    heroTagline: 'Logistics & Transportation Funding',
    heroHeadline: 'Logistics & Transportation choose Funded Experts.',
    heroDescription:
      'Transportation companies face high upfront expenses for fuel, maintenance, and driver payroll while waiting on broker invoices. We provide specialized freight capital and lines of credit to keep your fleet moving and profitable.',
    stat1Value: '24h',
    stat1Label: 'speed to fund',
    stat2Value: '4.8/5',
    stat2Label: 'Trust score rating',
    stat3Value: '$18M+',
    stat3Label: 'in transportation financing',
    stat4Value: '2,400+',
    stat4Label: 'carriers & logistics firms funded',
    benefitsTitle: 'Why fleet owners & logistics companies rely on us',
    benefits: [
      {
        title: 'Cover fuel, toll & maintenance costs upfront',
        description: 'Keep rigs on the road with immediate capital for fuel cards, tire changes, and emergency engine repairs.',
      },
      {
        title: 'Bridge 30 to 60-day broker payment terms',
        description: 'Don\'t let slow-paying shippers stall your operations. Access working capital against your steady deposit history.',
      },
      {
        title: 'Expand fleet & hire qualified drivers',
        description: 'Purchase or lease additional trucks and trailers to accept bigger freight contracts without delay.',
      },
      {
        title: 'No hard credit pull to see your options',
        description: 'Apply in 5 minutes with zero impact on personal or business credit scores.',
      },
    ],
    faqs: [
      {
        question: 'Do you offer funding for single-rig owner-operators and small fleets?',
        answer: 'Yes! We fund owner-operators, fleet owners, freight brokers, auto repair shops, and gas stations with $10,000+ monthly revenue.',
      },
      {
        question: 'Can I get funding for emergency truck repairs or overhaul?',
        answer: 'Absolutoely. Fast 24-hour funding allows you to repair breakdowns immediately and minimize costly downtime.',
      },
    ],
  },
  retail: {
    heroTagline: 'Retail & E-Commerce Funding',
    heroHeadline: 'Retail & E-Commerce choose Funded Experts.',
    heroDescription:
      'Success in retail demands buying inventory ahead of seasonal surges and expanding store locations. We deliver fast, flexible funding options that scale with your sales volume.',
    stat1Value: '13+',
    stat1Label: 'years in business financing',
    stat2Value: '4.8/5',
    stat2Label: 'merchant satisfaction rating',
    stat3Value: '$20M+',
    stat3Label: 'in retail & e-commerce capital',
    stat4Value: '2,800+',
    stat4Label: 'storefronts & online brands funded',
    benefitsTitle: 'Designed around retail cash flow cycles',
    benefits: [
      {
        title: 'Bulk inventory purchasing discounts',
        description: 'Secure supplier volume discounts by purchasing inventory early ahead of peak shopping seasons.',
      },
      {
        title: 'Revenue-aligned daily/weekly repayments',
        description: 'Repayments automatically flex with seasonal highs and lows, so your cash flow stays protected.',
      },
      {
        title: 'Capital for marketing & store expansions',
        description: 'Fund social media ad campaigns, website redesigns, or physical retail location rollouts.',
      },
      {
        title: 'Fast approval with minimal paperwork',
        description: 'No tax returns or lengthy financials required for most funding amounts. Just recent bank statements.',
      },
    ],
    faqs: [
      {
        question: 'Can e-commerce and Shopify sellers qualify for funding?',
        answer: 'Yes! Online brands, Shopify sellers, Amazon merchants, and physical retail stores with $10,000+ monthly sales qualify.',
      },
      {
        question: 'How do repayments work for seasonal retail stores?',
        answer: 'We offer revenue-based financing where payments scale based on your actual sales volume, easing the burden during slow months.',
      },
    ],
  },
  construction: {
    heroTagline: 'Construction & Trades Funding',
    heroHeadline: 'Construction & Trades choose Funded Experts.',
    heroDescription:
      'Contractors face a timing problem. You wait up to 90 days to get paid, but money goes out for payroll and equipment immediately. We provide fast working capital so you can bid bigger jobs and bridge cash flow gaps.',
    stat1Value: '13+',
    stat1Label: 'years of lending experience',
    stat2Value: '4.8/5',
    stat2Label: 'Trust score rating',
    stat3Value: '$16M+',
    stat3Label: 'in construction financing',
    stat4Value: '2,000+',
    stat4Label: 'contractors & trades funded',
    benefitsTitle: "Here's what funding your construction business looks like",
    benefits: [
      {
        title: 'No hard pull to apply',
        description: 'Checking your options won\'t affect your credit score, so you can evaluate qualified offers risk-free.',
      },
      {
        title: 'Funding in as little as 24 hours',
        description: 'When payroll is Friday and progress payments are delayed, speed matters. Receive capital as fast as 24 hours.',
      },
      {
        title: 'One simple form, multiple lender offers',
        description: 'Compare equipment loans, lines of credit, and revenue-based options tailored for general and sub-contractors.',
      },
      {
        title: 'Bridge gaps between draw schedules',
        description: 'Cover mobilization costs, purchase materials in bulk for discounts, and keep your crew paid on time.',
      },
    ],
    faqs: [
      {
        question: 'Can I qualify for construction funding with unpaid invoices or delayed draws?',
        answer: 'Yes! Revenue-based financing and lines of credit look at overall bank deposit volume rather than delayed invoice schedules.',
      },
      {
        question: 'What can I use construction business capital for?',
        answer: 'You can use capital for material purchasing, payroll, equipment leasing or repairs, subcontractor deposits, and project mobilization.',
      },
      {
        question: 'How fast can I get funding for a construction project?',
        answer: 'Once approved, funds can be deposited into your business bank account in as little as 24 hours.',
      },
    ],
  },
  restaurants: {
    heroTagline: 'Food & Hospitality Funding',
    heroHeadline: 'Restaurants choose Funded Experts.',
    heroDescription:
      'Food service runs on tight margins and unpredictable seasonality. We deliver fast working capital for equipment upgrades and inventory stocking so you can focus on serving guests.',
    stat1Value: '24h',
    stat1Label: 'average turnaround time',
    stat2Value: '4.8/5',
    stat2Label: 'client satisfaction score',
    stat3Value: '$12M+',
    stat3Label: 'in restaurant financing',
    stat4Value: '1,500+',
    stat4Label: 'eateries & bars funded',
    benefitsTitle: 'How we help restaurants succeed',
    benefits: [
      {
        title: 'Flexible repayment tied to daily revenue',
        description: 'Repayments adjust with your daily sales, keeping cash flow manageable during slow seasons.',
      },
      {
        title: 'Fast capital for equipment & kitchen repairs',
        description: 'Fix walk-in freezers, upgrade ovens, or remodel dining rooms without waiting weeks for bank approval.',
      },
      {
        title: 'Cover seasonal inventory & staffing spikes',
        description: 'Stock up on inventory and hire seasonal staff before holiday rushes or summer patios open.',
      },
    ],
    faqs: [
      {
        question: 'Do I need perfect credit to get restaurant financing?',
        answer: 'No. Our funding solutions evaluate overall monthly revenue and daily cash flow rather than relying solely on personal credit scores.',
      },
      {
        question: 'What documents are required to apply?',
        answer: 'We only require a simple online application and your last 3–4 months of business bank statements.',
      },
    ],
  },
};

export function getIndustryDetails(slug: string, name: string): IndustryDetail {
  const custom = industryDetailsMap[slug] || {};
  return {
    heroTagline: custom.heroTagline || `${name} Business Funding`,
    heroHeadline: custom.heroHeadline || `${name} choose Funded Experts.`,
    heroDescription:
      custom.heroDescription ||
      `${name} businesses need fast, reliable working capital for payroll, inventory, and growth. We provide funding designed around how ${name.toLowerCase()} operations work.`,
    stat1Value: custom.stat1Value || '13+',
    stat1Label: custom.stat1Label || 'years of lending experience',
    stat2Value: custom.stat2Value || '4.8/5',
    stat2Label: custom.stat2Label || 'Trust score rating',
    stat3Value: custom.stat3Value || '$16M+',
    stat3Label: custom.stat3Label || `in ${name.toLowerCase()} financing`,
    stat4Value: custom.stat4Value || '2,000+',
    stat4Label: custom.stat4Label || 'businesses funded',
    benefitsTitle: custom.benefitsTitle || `Here's what funding your ${name.toLowerCase()} business looks like`,
    benefits: custom.benefits || [
      {
        title: 'No hard pull to apply',
        description: 'Checking your options won\'t affect your credit score, so you can explore funding risk-free.',
      },
      {
        title: 'Funding in as little as 24 hours',
        description: 'Receive capital fast to cover urgent operational expenses, payroll, or business opportunities.',
      },
      {
        title: 'Flexible funding options',
        description: 'Compare lines of credit, revenue loans, and term options tailored for your industry.',
      },
    ],
    faqs: custom.faqs || [
      {
        question: `How fast can I get funding for my ${name.toLowerCase()} business?`,
        answer: 'Approvals take minutes, and funds are typically deposited into your account in as little as 24 hours.',
      },
      {
        question: `What are the minimum requirements to qualify for ${name.toLowerCase()} funding?`,
        answer: 'Minimum requirements generally include 6+ months in business and $10,000+ in monthly bank deposits.',
      },
    ],
  };
}
