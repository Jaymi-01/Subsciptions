import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { calculateTotals } from '../../utils/formatters';
import { CurrencyBurnCard } from '../../components/CurrencyBurnCard';
import { SubscriptionCard } from '../../components/SubscriptionCard';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { colors, theme } = useTheme();
  const { subscriptions, settings, toggleActive } = useSubscriptionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'trials'>('all');

  // Compute burn rate totals
  const totals = useMemo(() => {
    return calculateTotals(subscriptions, settings.usdToNgnRate);
  }, [subscriptions, settings.usdToNgnRate]);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return (subscriptions || [])
      .filter((sub) => {
        if (!sub) return false;
        if (filter === 'active') return sub.isActive;
        if (filter === 'paused') return !sub.isActive;
        if (filter === 'trials') return sub.isTrial;
        return true;
      })
      .filter((sub) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          (sub.name || '').toLowerCase().includes(q) ||
          (sub.category || '').toLowerCase().includes(q) ||
          (sub.paymentMethod && sub.paymentMethod.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return (a.nextBillingDate || '').localeCompare(b.nextBillingDate || '');
      });
  }, [subscriptions, filter, searchQuery]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* 1. Header (Settings is now in bottom tabs) */}
      <View style={styles.header}>
        <Text style={[styles.username, { color: colors.textDark }]}>
          Subscriptions
        </Text>
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* 2. Monthly Summary Card */}
            <CurrencyBurnCard
              totals={totals}
              usdToNgnRate={settings.usdToNgnRate}
              colors={colors}
              theme={theme}
            />

            {/* 3. Search Bar */}
            <View style={styles.searchSection}>
              <View
                style={[
                  styles.searchBar,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="search-outline" size={18} color={colors.textLight} />
                <TextInput
                  placeholder="Search subscriptions or cards..."
                  placeholderTextColor={colors.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={[styles.searchInput, { color: colors.textDark }]}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 4. Filter Tabs */}
            <View style={styles.filterTabs}>
              {[
                { id: 'all', label: `ALL (${subscriptions.length})` },
                {
                  id: 'active',
                  label: `ACTIVE (${subscriptions.filter((s) => s.isActive).length})`,
                },
                {
                  id: 'paused',
                  label: `PAUSED (${subscriptions.filter((s) => !s.isActive).length})`,
                },
                {
                  id: 'trials',
                  label: `TRIALS (${subscriptions.filter((s) => s.isTrial).length})`,
                },
              ].map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setFilter(tab.id as any)}
                    style={[
                      styles.tab,
                      {
                        backgroundColor: isActive ? colors.primary : colors.card,
                        borderColor: isActive ? colors.primary : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color: isActive
                            ? theme === 'dark'
                              ? '#140e08'
                              : colors.white
                            : colors.textLight,
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Empty State */}
            {filteredSubscriptions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={48}
                  color={colors.textLight}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.textDark },
                  ]}
                >
                  No Subscriptions Found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.textLight },
                  ]}
                >
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Tap the + button to add your first subscription'}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            subscription={item}
            usdToNgnRate={settings.usdToNgnRate}
            colors={colors}
            theme={theme}
            onPress={() => router.push(`/edit/${item.id}` as any)}
            onToggleActive={() => toggleActive(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        onPress={() => router.push('/add')}
      >
        <Ionicons
          name="add"
          size={32}
          color={theme === 'dark' ? '#140e08' : colors.white}
        />
      </TouchableOpacity>
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
    paddingBottom: 8,
  },
  username: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 110,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '900',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
