import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CurrencyTotals } from '../types/subscription';
import { formatCurrency } from '../utils/formatters';
import { ThemeColors } from '../constants/colors';

interface Props {
  totals: CurrencyTotals;
  usdToNgnRate: number;
  colors: ThemeColors;
  theme: 'light' | 'dark';
}

export const CurrencyBurnCard: React.FC<Props> = ({
  totals,
  usdToNgnRate,
  colors,
  theme,
}) => {
  return (
    <View
      key={`burn-card-${theme}`}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="wallet-outline" size={16} color={colors.primary} />
          <Text
            style={[
              styles.headerLabel,
              { color: colors.textLight },
            ]}
          >
            MONTHLY SPEND
          </Text>
        </View>

        <View
          style={[
            styles.ratePill,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.rateText,
              { color: colors.textDark },
            ]}
          >
            $1 = ₦{usdToNgnRate.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Main Total Number */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.mainAmount,
            { color: colors.textDark },
          ]}
        >
          {formatCurrency(totals.totalInNgn, 'NGN', false)}
        </Text>
        <Text
          style={[
            styles.cycleSuffix,
            { color: colors.textLight },
          ]}
        >
          / mo
        </Text>
      </View>

      {/* Split Grid for Naira and Dollar breakdown */}
      <View style={styles.splitGrid}>
        <View
          style={[
            styles.splitBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.splitLabel, { color: colors.textLight }]}>
            NAIRA CHARGES
          </Text>
          <Text style={[styles.splitValue, { color: colors.textDark }]}>
            {formatCurrency(totals.totalNgnDirect, 'NGN', false)}
          </Text>
        </View>

        <View
          style={[
            styles.splitBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.splitLabel, { color: colors.textLight }]}>
            DOLLAR CHARGES
          </Text>
          <Text style={[styles.splitValue, { color: colors.textDark }]}>
            {formatCurrency(totals.totalUsdDirect, 'USD', true)}
          </Text>
        </View>
      </View>

      {/* Annual Run Rate Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerLeft}>
          <Ionicons name="calendar-outline" size={15} color={colors.primary} />
          <Text style={[styles.annualLabel, { color: colors.textLight }]}>
            Estimated Annual:
          </Text>
        </View>
        <Text style={[styles.annualValue, { color: colors.textDark }]}>
          {formatCurrency(totals.annualInNgn, 'NGN', false)} / yr
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '900',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 16,
  },
  mainAmount: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cycleSuffix: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
  },
  splitGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  splitBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  splitLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  splitValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  annualLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  annualValue: {
    fontSize: 14,
    fontWeight: '900',
  },
});
