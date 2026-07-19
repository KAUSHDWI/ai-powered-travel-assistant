export const FIELD_LABELS = {
  destination: 'Destination',
  departureCity: 'Departure City',
  travelDate: 'Travel Date',
  duration: 'Duration',
  travellers: 'Travellers',
  budget: 'Budget',
  tripType: 'Trip Type',
  specialRequirements: 'Special Requirements',
  name: 'Full Name',
  phone: 'Phone Number',
  email: 'Email Address',
} as const;

export const SUGGESTED_PROMPTS = [
  {
    icon: '🌴',
    text: 'I want to plan a tropical beach honeymoon.',
    label: 'Honeymoon'
  },
  {
    icon: '🏰',
    text: 'Suggest a family vacation in Europe for 10 days.',
    label: 'Family Trip'
  },
  {
    icon: '🏔️',
    text: 'Looking for a solo adventure trip in the mountains.',
    label: 'Adventure'
  },
  {
    icon: '🗼',
    text: 'Need to organize a corporate retreat in Tokyo.',
    label: 'Business'
  }
] as const;

export const CONFIDENCE_COLORS = {
  Low: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  Medium: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  },
  High: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  }
} as const;

export const INTENT_BADGES = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  High: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Very High': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Maximum: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'travel_lead_admin_token',
  REFRESH_TOKEN: 'travel_lead_admin_refresh_token',
  CONVERSATION_ID: 'travel_lead_conversation_id',
  THEME: 'travel_lead_theme',
} as const;
