import { Category, Currency } from '../types/subscription';

export interface ServicePreset {
  name: string;
  category: Category;
  defaultCurrency: Currency;
  suggestedAmount?: number;
  color: string;
  icon: string;
}

export const PRESET_SERVICES: ServicePreset[] = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    defaultCurrency: 'NGN',
    suggestedAmount: 5000,
    color: '#E50914',
    icon: 'movie-play',
  },
  {
    name: 'Spotify',
    category: 'Entertainment',
    defaultCurrency: 'NGN',
    suggestedAmount: 1300,
    color: '#1DB954',
    icon: 'spotify',
  },
  {
    name: 'ChatGPT Plus',
    category: 'Productivity',
    defaultCurrency: 'USD',
    suggestedAmount: 20,
    color: '#10A37F',
    icon: 'robot',
  },
  {
    name: 'Claude Pro',
    category: 'Productivity',
    defaultCurrency: 'USD',
    suggestedAmount: 20,
    color: '#D97706',
    icon: 'brain',
  },
  {
    name: 'GitHub Copilot',
    category: 'Developer & Cloud',
    defaultCurrency: 'USD',
    suggestedAmount: 10,
    color: '#24292E',
    icon: 'github',
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment',
    defaultCurrency: 'NGN',
    suggestedAmount: 1700,
    color: '#FF0000',
    icon: 'youtube',
  },
  {
    name: 'Apple Music / One',
    category: 'Entertainment',
    defaultCurrency: 'NGN',
    suggestedAmount: 1500,
    color: '#FC3C44',
    icon: 'apple',
  },
  {
    name: 'iCloud+',
    category: 'Utilities',
    defaultCurrency: 'USD',
    suggestedAmount: 0.99,
    color: '#0070C9',
    icon: 'cloud',
  },
  {
    name: 'Amazon Prime Video',
    category: 'Entertainment',
    defaultCurrency: 'NGN',
    suggestedAmount: 2300,
    color: '#00A8E1',
    icon: 'amazon',
  },
  {
    name: 'Google One',
    category: 'Utilities',
    defaultCurrency: 'USD',
    suggestedAmount: 1.99,
    color: '#4285F4',
    icon: 'google-drive',
  },
  {
    name: 'DigitalOcean / VPS',
    category: 'Developer & Cloud',
    defaultCurrency: 'USD',
    suggestedAmount: 12,
    color: '#0080FF',
    icon: 'server',
  },
  {
    name: 'Gym Membership',
    category: 'Health & Fitness',
    defaultCurrency: 'NGN',
    suggestedAmount: 25000,
    color: '#EA580C',
    icon: 'dumbbell',
  },
  {
    name: 'Home Internet / Fibre',
    category: 'Utilities',
    defaultCurrency: 'NGN',
    suggestedAmount: 25000,
    color: '#7C3AED',
    icon: 'wifi',
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: '#EF4444',
  Productivity: '#3B82F6',
  'Developer & Cloud': '#8B5CF6',
  Utilities: '#10B981',
  'Health & Fitness': '#F59E0B',
  Education: '#EC4899',
  Other: '#6B7280',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Entertainment: 'filmstrip',
  Productivity: 'briefcase-check',
  'Developer & Cloud': 'code-tags',
  Utilities: 'lightning-bolt',
  'Health & Fitness': 'heart-pulse',
  Education: 'school',
  Other: 'tag-outline',
};
