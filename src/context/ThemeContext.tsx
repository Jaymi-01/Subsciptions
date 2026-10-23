import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { COLORS, darkColors, ThemeColors } from '../constants/colors';
import { useSubscriptionStore } from '../store/subscriptionStore';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  colors: ThemeColors;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  colors: COLORS,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const settings = useSubscriptionStore((state) => state.settings);
  const updateSettings = useSubscriptionStore((state) => state.updateSettings);

  const theme: 'light' | 'dark' = settings?.theme || 'light';

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'light' ? 'dark' : 'light' });
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    updateSettings({ theme: newTheme });
  };

  const colors = theme === 'dark' ? darkColors : COLORS;

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme, colors }),
    [theme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
