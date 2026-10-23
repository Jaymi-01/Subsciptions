import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useTheme } from '../../context/ThemeContext';
import {
  calculateTotals,
  formatCurrency,
  getMonthlyEquivalent,
} from '../../utils/formatters';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { subscriptions, settings } = useSubscriptionStore();

  const rate = settings.usdToNgnRate || 1550;

  // Active subscriptions with normalized monthly cost in Naira
  const activeSubsWithMonthlyCost = useMemo(() => {
    return (subscriptions || [])
      .filter((s) => s.isActive)
      .map((sub) => {
        const monthlyAmount = getMonthlyEquivalent(sub.amount, sub.billingCycle);
        const monthlyInNgn =
          sub.currency === 'USD' ? monthlyAmount * rate : monthlyAmount;
        return {
          ...sub,
          monthlyEquivalent: monthlyAmount,
          monthlyInNgn,
        };
      })
      .sort((a, b) => b.monthlyInNgn - a.monthlyInNgn);
  }, [subscriptions, rate]);

  // Overall totals
  const totals = useMemo(() => {
    return calculateTotals(subscriptions, rate);
  }, [subscriptions, rate]);

  // Insights calculations
  const highestSub = activeSubsWithMonthlyCost[0] || null;
  const lowestSub =
    activeSubsWithMonthlyCost.length > 1
      ? activeSubsWithMonthlyCost[activeSubsWithMonthlyCost.length - 1]
      : null;

  const totalMonthly = totals.totalInNgn || 1; // prevent divide by 0
  const avgMonthly =
    activeSubsWithMonthlyCost.length > 0
      ? totals.totalInNgn / activeSubsWithMonthlyCost.length
      : 0;

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    activeSubsWithMonthlyCost.forEach((s) => {
      const cat = s.category || 'Other';
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += s.monthlyInNgn;
      map[cat].count += 1;
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
        percent: Math.round((data.total / totalMonthly) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [activeSubsWithMonthlyCost, totalMonthly]);

  // Currency percentage breakdown
  const ngnPercent = Math.round((totals.totalNgnDirect / totalMonthly) * 100);
  const usdPercent = 100 - ngnPercent;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textDark }]}>
          Analytics
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          SPENDING INSIGHTS & BREAKDOWN
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {activeSubsWithMonthlyCost.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pie-chart-outline" size={48} color={colors.textLight} />
            <Text style={[styles.emptyTitle, { color: colors.textDark }]}>
              No Active Subscriptions
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
              Add subscriptions to see graphs and spending analytics.
            </Text>
          </View>
        ) : (
          <>
            {/* 1. Highlight Cards Grid (readcount-new dashboardCard style) */}
            <View style={styles.grid}>
              {/* Highest Expense Card */}
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.statHeader}>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>
                    HIGHEST EXPENSE
                  </Text>
                  <Ionicons name="flame-outline" size={16} color={colors.primary} />
                </View>
                <Text
                  style={[styles.statName, { color: colors.textDark }]}
                  numberOfLines={1}
                >
                  {highestSub ? highestSub.name : 'None'}
                </Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {highestSub
                    ? formatCurrency(highestSub.monthlyInNgn, 'NGN', false) + '/mo'
                    : '₦0'}
                </Text>
                {highestSub && (
                  <Text style={[styles.statFootnote, { color: colors.textLight }]}>
                    {Math.round((highestSub.monthlyInNgn / totalMonthly) * 100)}% of total monthly spend
                  </Text>
                )}
              </View>

              {/* Average / Service Card */}
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.statHeader}>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>
                    AVERAGE / SERVICE
                  </Text>
                  <Ionicons name="calculator-outline" size={16} color={colors.primary} />
                </View>
                <Text
                  style={[styles.statName, { color: colors.textDark }]}
                  numberOfLines={1}
                >
                  {activeSubsWithMonthlyCost.length} Active Services
                </Text>
                <Text style={[styles.statValue, { color: colors.textDark }]}>
                  {formatCurrency(avgMonthly, 'NGN', false)}/mo
                </Text>
                <Text style={[styles.statFootnote, { color: colors.textLight }]}>
                  {subscriptions.length - activeSubsWithMonthlyCost.length} paused subscriptions
                </Text>
              </View>
            </View>

            {/* 2. Visual Ranking Bar Graph (Cost per Subscription) */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.textDark }]}>
                  Subscriptions by Cost
                </Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.textLight }]}>
                Ranked from highest to lowest monthly equivalent:
              </Text>

              <View style={styles.barsContainer}>
                {activeSubsWithMonthlyCost.map((sub, index) => {
                  const percentOfTotal = Math.max(
                    6,
                    Math.round((sub.monthlyInNgn / totalMonthly) * 100)
                  );
                  return (
                    <View key={sub.id} style={styles.barItem}>
                      <View style={styles.barItemHeader}>
                        <Text
                          style={[styles.barRank, { color: colors.primary }]}
                        >
                          #{index + 1}
                        </Text>
                        <Text
                          style={[styles.barSubName, { color: colors.textDark }]}
                          numberOfLines={1}
                        >
                          {sub.name}
                        </Text>
                        <Text
                          style={[styles.barSubCost, { color: colors.textDark }]}
                        >
                          {formatCurrency(sub.monthlyInNgn, 'NGN', false)}
                          <Text style={{ fontSize: 11, color: colors.textLight }}>
                            /mo
                          </Text>
                        </Text>
                      </View>

                      {/* Bar Fill */}
                      <View
                        style={[
                          styles.barTrack,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${percentOfTotal}%`,
                              backgroundColor: colors.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 3. Category Breakdown */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Ionicons name="pie-chart-outline" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.textDark }]}>
                  Category Distribution
                </Text>
              </View>

              <View style={styles.barsContainer}>
                {categoryStats.map((cat) => (
                  <View key={cat.name} style={styles.barItem}>
                    <View style={styles.barItemHeader}>
                      <Text
                        style={[styles.barSubName, { color: colors.textDark }]}
                      >
                        {cat.name} ({cat.count})
                      </Text>
                      <Text
                        style={[styles.barSubCost, { color: colors.textDark }]}
                      >
                        {formatCurrency(cat.total, 'NGN', false)}
                        <Text style={{ fontSize: 11, color: colors.textLight }}>
                          {' '}
                          ({cat.percent}%)
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.barTrack,
                        { backgroundColor: colors.background },
                      ]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${Math.max(6, cat.percent)}%`,
                            backgroundColor: colors.reading,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. Currency Split Bar */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Ionicons name="swap-horizontal-outline" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.textDark }]}>
                  Currency Split
                </Text>
              </View>

              {/* Proportional Dual Bar */}
              <View style={styles.currencyTrack}>
                <View
                  style={[
                    styles.currencyBarNgn,
                    {
                      flex: Math.max(1, ngnPercent),
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.currencyBarUsd,
                    {
                      flex: Math.max(1, usdPercent),
                      backgroundColor: colors.toRead,
                    },
                  ]}
                />
              </View>

              {/* Legend */}
              <View style={styles.currencyLegend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <Text style={[styles.legendText, { color: colors.textDark }]}>
                    Naira: {ngnPercent}% (
                    {formatCurrency(totals.totalNgnDirect, 'NGN', false)})
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.toRead },
                    ]}
                  />
                  <Text style={[styles.legendText, { color: colors.textDark }]}>
                    Dollar: {usdPercent}% (
                    {formatCurrency(totals.totalUsdDirect, 'USD', true)})
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  statName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  statFootnote: {
    fontSize: 10,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 14,
  },
  barsContainer: {
    gap: 14,
  },
  barItem: {},
  barItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barRank: {
    fontSize: 12,
    fontWeight: '900',
    marginRight: 6,
  },
  barSubName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  barSubCost: {
    fontSize: 14,
    fontWeight: '900',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  currencyTrack: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 14,
  },
  currencyBarNgn: {
    height: '100%',
  },
  currencyBarUsd: {
    height: '100%',
  },
  currencyLegend: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
