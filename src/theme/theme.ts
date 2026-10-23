import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';
import { COLORS, darkColors } from '../constants/colors';

// Paper Theme mapped to readcount-new's warm sepia & rich wood palette
export const customDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary, // #dda15e
    onPrimary: '#1a120b',
    primaryContainer: darkColors.primaryLight, // #432818
    onPrimaryContainer: darkColors.textDark, // #f2e8cf
    secondary: darkColors.secondary, // #fbbf24
    background: darkColors.background, // #1a120b
    surface: darkColors.card, // #2c1e14
    surfaceVariant: darkColors.primaryLight, // #432818
    onSurface: darkColors.textDark, // #f2e8cf
    onSurfaceVariant: darkColors.textLight, // #b08968
    outline: darkColors.border,
    outlineVariant: darkColors.border,
    error: darkColors.danger,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: darkColors.card,
      level2: '#352418',
      level3: '#432818',
      level4: '#523420',
      level5: '#603d27',
    },
  },
};

export const customLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary, // #bc6c25
    onPrimary: COLORS.white,
    primaryContainer: COLORS.primaryLight, // #faedcd
    onPrimaryContainer: COLORS.textDark, // #432818
    secondary: COLORS.secondary, // #f59e0b
    background: COLORS.background, // #f2e8cf
    surface: COLORS.card, // #fdfbf0
    surfaceVariant: COLORS.primaryLight, // #faedcd
    onSurface: COLORS.textDark, // #432818
    onSurfaceVariant: COLORS.textLight, // #99582a
    outline: COLORS.border,
    outlineVariant: COLORS.primaryLight,
    error: COLORS.danger,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: COLORS.card,
      level2: '#fbf7e8',
      level3: '#faedcd',
      level4: '#f5deb3',
      level5: '#edd6a6',
    },
  },
};
