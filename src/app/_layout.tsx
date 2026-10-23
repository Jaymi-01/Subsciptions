import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission } from '../services/notifications';
import { customDarkTheme, customLightTheme } from '../theme/theme';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootNavigator() {
  const { theme, colors } = useTheme();
  const paperTheme = theme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textDark,
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 20,
            color: colors.textDark,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add"
          options={{
            presentation: 'modal',
            title: 'Add Subscription',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        <Stack.Screen
          name="edit/[id]"
          options={{
            presentation: 'modal',
            title: 'Edit Subscription',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
