import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Subscription } from '../types/subscription';
import { scheduleSubscriptionReminder } from '../services/notifications';

interface SubscriptionState {
  subscriptions: Subscription[];
  settings: AppSettings;
  isHydrated: boolean;

  // Actions
  addSubscription: (sub: Omit<Subscription, 'id' | 'createdAt'>) => Promise<string>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => void;
  importSubscriptions: (subs: Subscription[], settings?: Partial<AppSettings>) => void;
  setHydrated: (state: boolean) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  usdToNgnRate: 1550, // Default 1 USD = ₦1,550
  defaultCurrency: 'NGN',
  notificationsEnabled: true,
  theme: 'light',
};

// Static dates to prevent SSR hydration mismatches
const INITIAL_DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'demo-1',
    name: 'Netflix',
    amount: 5000,
    currency: 'NGN',
    billingCycle: 'monthly',
    firstPaymentDate: '2026-10-01',
    nextBillingDate: '2026-11-01',
    category: 'Entertainment',
    paymentMethod: 'GTBank Visa',
    isTrial: false,
    isActive: true,
    reminderDaysBefore: 2,
    color: '#E50914',
    icon: 'movie-play',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'demo-2',
    name: 'ChatGPT Plus',
    amount: 20,
    currency: 'USD',
    billingCycle: 'monthly',
    firstPaymentDate: '2026-10-05',
    nextBillingDate: '2026-11-05',
    category: 'Productivity',
    paymentMethod: 'UBA Dollar Card',
    isTrial: false,
    isActive: true,
    reminderDaysBefore: 2,
    color: '#10A37F',
    icon: 'robot',
    createdAt: '2026-10-05T00:00:00.000Z',
  },
  {
    id: 'demo-3',
    name: 'Spotify',
    amount: 1300,
    currency: 'NGN',
    billingCycle: 'monthly',
    firstPaymentDate: '2026-10-15',
    nextBillingDate: '2026-11-15',
    category: 'Entertainment',
    paymentMethod: 'Kuda Card',
    isTrial: false,
    isActive: true,
    reminderDaysBefore: 1,
    color: '#1DB954',
    icon: 'spotify',
    createdAt: '2026-10-15T00:00:00.000Z',
  },
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: INITIAL_DEMO_SUBSCRIPTIONS,
      settings: DEFAULT_SETTINGS,
      isHydrated: false,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      addSubscription: async (subData) => {
        const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const newSub: Subscription = {
          ...subData,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          subscriptions: [newSub, ...state.subscriptions],
        }));

        if (get().settings.notificationsEnabled) {
          await scheduleSubscriptionReminder(newSub);
        }

        return id;
      },

      updateSubscription: async (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));

        const updated = get().subscriptions.find((s) => s.id === id);
        if (updated && get().settings.notificationsEnabled) {
          await scheduleSubscriptionReminder(updated);
        }
      },

      deleteSubscription: async (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      toggleActive: async (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
          ),
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      importSubscriptions: (subs, newSettings) => {
        set((state) => ({
          subscriptions: subs,
          settings: newSettings ? { ...state.settings, ...newSettings } : state.settings,
        }));
      },
    }),
    {
      name: 'personal-subscription-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
