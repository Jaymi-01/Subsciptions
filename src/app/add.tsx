import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { useTheme } from '../context/ThemeContext';

export default function AddScreen() {
  const { colors } = useTheme();
  const { addSubscription } = useSubscriptionStore();

  const handleAdd = async (data: any) => {
    await addSubscription(data);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'New Subscription',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textDark,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 18,
            color: colors.textDark,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingRight: 12, paddingVertical: 6 }}
            >
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          ),
        }}
      />
      <SubscriptionForm
        onSubmit={handleAdd}
        submitButtonText="Add Subscription"
        isEditing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
