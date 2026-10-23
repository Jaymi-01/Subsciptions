import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { requestNotificationPermission } from '../../services/notifications';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { settings, updateSettings, subscriptions, importSubscriptions } =
    useSubscriptionStore();

  const [rateInput, setRateInput] = useState(settings.usdToNgnRate.toString());
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const handleSaveRate = () => {
    const parsed = parseFloat(rateInput);
    if (!isNaN(parsed) && parsed > 0) {
      updateSettings({ usdToNgnRate: parsed });
      Alert.alert('Saved', `USD exchange rate set to ₦${parsed.toLocaleString()}`);
    } else {
      Alert.alert('Invalid Rate', 'Please enter a valid positive number');
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in device settings to receive renewal reminders.'
        );
        return;
      }
    }
    updateSettings({ notificationsEnabled: val });
  };

  const handleExport = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      subscriptions,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    setImportJsonText(jsonStr);
    setImportModalVisible(true);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed.subscriptions)) {
        importSubscriptions(parsed.subscriptions, parsed.settings);
        setImportModalVisible(false);
        setImportJsonText('');
        Alert.alert(
          'Success',
          `Imported ${parsed.subscriptions.length} subscriptions successfully.`
        );
      } else {
        Alert.alert('Invalid Format', 'JSON must contain a subscriptions array.');
      }
    } catch {
      Alert.alert(
        'Parse Error',
        'Please verify that the JSON data is formatted correctly.'
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textDark }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          PREFERENCES & DATA
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* 1. Theme Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            APPEARANCE
          </Text>
          <View
            style={[
              styles.cardRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={colors.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>
                  {theme === 'dark' ? 'Dark Sepia Mode' : 'Light Paper Mode'}
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textLight }]}>
                  {theme === 'dark'
                    ? 'Ebony & Cocoa palette'
                    : 'Warm Sepia & Paper palette'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* 2. Currency & Exchange Rate */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            EXCHANGE RATE
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardDesc, { color: colors.textLight }]}>
              Dollar ($) subscriptions will be converted into your total Naira (₦) spend using this rate:
            </Text>
            <View style={styles.rateRow}>
              <View
                style={[
                  styles.rateInputBox,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.ratePrefix, { color: colors.primary }]}>
                  ₦
                </Text>
                <TextInput
                  value={rateInput}
                  onChangeText={setRateInput}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 1550"
                  placeholderTextColor={colors.textLight}
                  style={[styles.rateInput, { color: colors.textDark }]}
                />
              </View>
              <TouchableOpacity
                style={[styles.saveRateBtn, { backgroundColor: colors.primary }]}
                onPress={handleSaveRate}
                activeOpacity={0.8}
              >
                <Text style={styles.saveRateBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Renewal Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            RENEWAL REMINDERS
          </Text>
          <View
            style={[
              styles.cardRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>
                  Local Notifications
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textLight }]}>
                  Get alerted before payments or free trials expire
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* 4. Data Backup & Local Storage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            DATA & BACKUP
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleExport}
              activeOpacity={0.7}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={colors.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>
                  Export Backup (JSON)
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textLight }]}>
                  Copy all your subscriptions data for safekeeping
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setImportJsonText('');
                setImportModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="cloud-download-outline"
                size={20}
                color={colors.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>
                  Import / Restore Data
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textLight }]}>
                  Paste backup JSON to restore subscriptions
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* JSON Modal */}
      <Modal
        visible={importModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textDark }]}>
                Backup & Restore
              </Text>
              <TouchableOpacity onPress={() => setImportModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>
              Copy this JSON data to back up, or paste valid JSON to restore subscriptions.
            </Text>

            <TextInput
              multiline
              numberOfLines={10}
              value={importJsonText}
              onChangeText={setImportJsonText}
              style={[
                styles.jsonInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textDark,
                },
              ]}
              placeholder="Paste JSON data here..."
              placeholderTextColor={colors.textLight}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setImportModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalBtnText, { color: colors.textDark }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleImport}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalBtnText, { color: colors.white }]}>
                  Import
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  rateInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  ratePrefix: {
    fontSize: 18,
    fontWeight: '900',
    marginRight: 6,
  },
  rateInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  saveRateBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveRateBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  jsonInput: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
