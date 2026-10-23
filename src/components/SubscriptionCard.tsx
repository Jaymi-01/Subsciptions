import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Subscription } from '../types/subscription';
import { formatCurrency, formatRenewalDate, getDaysRemaining } from '../utils/formatters';
import { ThemeColors } from '../constants/colors';

interface Props {
  subscription: Subscription;
  usdToNgnRate: number;
  colors: ThemeColors;
  theme: 'light' | 'dark';
  onPress: () => void;
  onToggleActive: () => void;
}

export const SubscriptionCard: React.FC<Props> = ({
  subscription,
  usdToNgnRate,
  colors,
  theme,
  onPress,
  onToggleActive,
}) => {
  const daysLeft = getDaysRemaining(subscription.nextBillingDate);
  const isDueSoon = daysLeft >= 0 && daysLeft <= 3 && subscription.isActive;

  const cycleAbbr = {
    weekly: '/wk',
    monthly: '/mo',
    quarterly: '/qtr',
    yearly: '/yr',
  }[subscription.billingCycle];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDueSoon ? colors.danger : colors.border,
          opacity: subscription.isActive ? 1 : 0.5,
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Title & Metadata */}
        <View style={styles.infoCol}>
          <View style={styles.titleLine}>
            <Text
              style={[
                styles.name,
                { color: colors.textDark },
              ]}
              numberOfLines={1}
            >
              {subscription.name}
            </Text>
            {subscription.isTrial && (
              <View
                style={[
                  styles.trialBadge,
                  { backgroundColor: colors.toReadBg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.trialBadgeText, { color: colors.primary }]}>
                  TRIAL
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.metaText,
              { color: colors.textLight },
            ]}
          >
            {subscription.category}
            {subscription.paymentMethod ? `  ·  ${subscription.paymentMethod}` : ''}
          </Text>
        </View>

        {/* Price Column */}
        <View style={styles.priceCol}>
          <Text
            style={[
              styles.priceAmount,
              { color: colors.textDark },
            ]}
          >
            {formatCurrency(subscription.amount, subscription.currency)}
            <Text style={[styles.cycleText, { color: colors.textLight }]}>
              {cycleAbbr}
            </Text>
          </Text>
          {subscription.currency === 'USD' && (
            <Text style={[styles.convertedText, { color: colors.textLight }]}>
              ~{formatCurrency(subscription.amount * usdToNgnRate, 'NGN', false)}
            </Text>
          )}
        </View>
      </View>

      {/* Footer Info & Toggle */}
      <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
        <View style={styles.dateBlock}>
          <Ionicons
            name={
              !subscription.isActive
                ? 'pause-circle-outline'
                : isDueSoon
                ? 'alert-circle-outline'
                : 'calendar-outline'
            }
            size={15}
            color={
              !subscription.isActive
                ? colors.textLight
                : isDueSoon
                ? colors.danger
                : colors.primary
            }
          />
          <Text
            style={[
              styles.dateText,
              {
                color: !subscription.isActive
                  ? colors.textLight
                  : isDueSoon
                  ? colors.danger
                  : colors.textDark,
                fontWeight: isDueSoon ? '900' : '700',
              },
            ]}
          >
            {subscription.isActive
              ? `Renews ${formatRenewalDate(subscription.nextBillingDate)}`
              : 'Paused'}
          </Text>
        </View>

        <Switch
          value={subscription.isActive}
          onValueChange={onToggleActive}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
          style={styles.switch}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
    paddingRight: 10,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  trialBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  trialBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 17,
    fontWeight: '900',
  },
  cycleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  convertedText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
