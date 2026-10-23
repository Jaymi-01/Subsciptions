import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { SubscriptionForm } from '../../components/SubscriptionForm';
import { useTheme } from '../../context/ThemeContext';

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { subscriptions, updateSubscription, deleteSubscription } =
    useSubscriptionStore();

  const subscription = subscriptions.find((s) => s.id === id);

  if (!subscription) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textDark }}>
          Subscription not found
        </Text>
      </View>
    );
  }

  const handleUpdate = async (data: any) => {
    if (id) {
      await updateSubscription(id, data);
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete ${subscription.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deleteSubscription(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `Edit ${subscription.name}`,
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
        initialValues={subscription}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitButtonText="Update Subscription"
        isEditing={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
