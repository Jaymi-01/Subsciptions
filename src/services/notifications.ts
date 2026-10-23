import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { parseISO, subDays } from 'date-fns';
import { Subscription } from '../types/subscription';
import { formatCurrency } from '../utils/formatters';

// Set up notification handler so alerts appear when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleSubscriptionReminder = async (
  subscription: Subscription
): Promise<string | null> => {
  if (Platform.OS === 'web' || !subscription.isActive) return null;

  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;

    const billingDate = parseISO(subscription.nextBillingDate);
    // Schedule reminder X days before at 9:00 AM
    const reminderDate = subDays(billingDate, subscription.reminderDaysBefore);
    reminderDate.setHours(9, 0, 0, 0);

    const now = new Date();
    if (reminderDate <= now) {
      // Date is already in past, don't schedule
      return null;
    }

    const priceText = formatCurrency(subscription.amount, subscription.currency);
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: subscription.isTrial
          ? `⚠️ Free Trial Ending: ${subscription.name}`
          : `Upcoming Renewal: ${subscription.name}`,
        body: subscription.isTrial
          ? `Your ${subscription.name} trial ends soon (${priceText} renewal). Cancel now if you don't wish to continue.`
          : `${subscription.name} will renew for ${priceText} in ${
              subscription.reminderDaysBefore === 0
                ? 'today'
                : `${subscription.reminderDaysBefore} day(s)`
            }.`,
        data: { subscriptionId: subscription.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    return identifier;
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
    return null;
  }
};

export const cancelReminder = async (notificationId: string): Promise<void> => {
  if (Platform.OS === 'web' || !notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
};
