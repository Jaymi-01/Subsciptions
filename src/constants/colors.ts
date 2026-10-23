export type ThemeColors = typeof COLORS;

export const COLORS = {
  primary: '#bc6c25', // Rich Wood (Tiger's Eye)
  primaryLight: '#faedcd', // Warm Cream wash
  secondary: '#f59e0b', // Golden Amber
  background: '#f2e8cf', // Warm Sepia Background
  card: '#fdfbf0', // Light Paper/Sepia Card
  textDark: '#432818', // Deep Coffee/Chocolate
  textLight: '#99582a', // Medium Brown/Sienna
  white: '#ffffff',

  // Status Colors (Warm & Earthy)
  reading: '#dda15e', // Golden Ochre
  readingBg: '#fef3c7',
  toRead: '#92400e', // Deep Amber/Wood
  toReadBg: '#faedcd',
  read: '#432818', // Ink Black/Brown
  readBg: '#f2e8cf',

  danger: '#bc4749', // Muted Brick Red
  success: '#bc6c25',
  border: '#dda15e80', // Ochre Border

  // Chart & UI Accents
  chart: [
    '#bc6c25',
    '#dda15e',
    '#f59e0b',
    '#92400e',
    '#432818',
    '#99582a',
    '#bc4749',
    '#603808',
  ],
};

export const darkColors: ThemeColors = {
  primary: '#dda15e', // Lighter Ochre
  primaryLight: '#352418', // Deep Coffee wash
  secondary: '#fbbf24', // Brighter Amber
  background: '#140e08', // Deep Warm Ebony (rich, true dark)
  card: '#22170f', // Rich Dark Cocoa (clean dark card)
  textDark: '#f5ede0', // Warm Alabaster/White text
  textLight: '#a88567', // Warm Muted Tan text
  white: '#ffffff',

  reading: '#dda15e',
  readingBg: '#352418',
  toRead: '#dda15e',
  toReadBg: '#22170f',
  read: '#f5ede0',
  readBg: '#352418',

  danger: '#e05355',
  success: '#dda15e',
  border: '#3a271a', // Subtle dark border

  chart: [
    '#dda15e',
    '#bc6c25',
    '#fbbf24',
    '#f5ede0',
    '#e05355',
    '#a88567',
    '#603808',
    '#352418',
  ],
};
