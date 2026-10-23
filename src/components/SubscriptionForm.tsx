import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Switch,
} from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import {
  BillingCycle,
  Category,
  Currency,
  Subscription,
} from '../types/subscription';
import { useTheme } from '../context/ThemeContext';

interface Props {
  initialValues?: Partial<Subscription>;
  onSubmit: (data: Omit<Subscription, 'id' | 'createdAt'>) => void;
  onDelete?: () => void;
  submitButtonText?: string;
  isEditing?: boolean;
}

const CATEGORIES: Category[] = [
  'Entertainment',
  'Productivity',
  'Developer & Cloud',
  'Utilities',
  'Health & Fitness',
  'Education',
  'Other',
];

const BILLING_CYCLES: { id: BillingCycle; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'quarterly', label: 'Quarterly' },
];

const REMINDER_OPTIONS = [
  { val: 0, label: 'Day of' },
  { val: 1, label: '1d before' },
  { val: 2, label: '2d before' },
  { val: 3, label: '3d before' },
];

export const SubscriptionForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  onDelete,
  submitButtonText = 'Save Subscription',
  isEditing = false,
}) => {
  const { colors } = useTheme();

  // State
  const [name, setName] = useState(initialValues?.name || '');
  const [amount, setAmount] = useState(
    initialValues?.amount !== undefined ? initialValues.amount.toString() : ''
  );
  const [currency, setCurrency] = useState<Currency>(
    initialValues?.currency || 'NGN'
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initialValues?.billingCycle || 'monthly'
  );
  const [category, setCategory] = useState<Category>(
    initialValues?.category || 'Entertainment'
  );
  const [nextBillingDate, setNextBillingDate] = useState<Date>(
    initialValues?.nextBillingDate
      ? parseISO(initialValues.nextBillingDate)
      : new Date()
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialValues?.paymentMethod || ''
  );
  const [reminderDays, setReminderDays] = useState<number>(
    initialValues?.reminderDaysBefore ?? 2
  );
  const [isTrial, setIsTrial] = useState<boolean>(initialValues?.isTrial || false);
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [cancelUrl, setCancelUrl] = useState(initialValues?.cancelUrl || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNextBillingDate(selectedDate);
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) {
      setHasError(true);
      return;
    }

    const dateStr = format(nextBillingDate, 'yyyy-MM-dd');

    onSubmit({
      name: name.trim(),
      amount: numAmount,
      currency,
      billingCycle,
      firstPaymentDate: dateStr,
      nextBillingDate: dateStr,
      category,
      paymentMethod: paymentMethod.trim() || undefined,
      isTrial,
      isActive: initialValues?.isActive ?? true,
      reminderDaysBefore: reminderDays,
      notes: notes.trim() || undefined,
      cancelUrl: cancelUrl.trim() || undefined,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Subscription Name */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          SUBSCRIPTION NAME *
        </Text>
        <TextInput
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (hasError) setHasError(false);
          }}
          placeholder="e.g. Netflix, Spotify, Gym, Fibre"
          placeholderTextColor={colors.textLight}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: hasError && !name.trim() ? colors.danger : colors.border,
              color: colors.textDark,
            },
          ]}
        />
      </View>

      {/* 2. Amount & Currency (Clean unified card block) */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          COST & CURRENCY *
        </Text>
        <View
          style={[
            styles.costCard,
            {
              backgroundColor: colors.card,
              borderColor:
                hasError && (!amount || isNaN(parseFloat(amount)))
                  ? colors.danger
                  : colors.border,
            },
          ]}
        >
          {/* Currency Toggle */}
          <View style={styles.currencyToggleRow}>
            {(['NGN', 'USD'] as Currency[]).map((c) => {
              const selected = currency === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCurrency(c)}
                  style={[
                    styles.currencyBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.background,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.currencyBtnText,
                      { color: selected ? colors.white : colors.textDark },
                    ]}
                  >
                    {c === 'NGN' ? '₦ Naira' : '$ Dollar'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Amount Number Input */}
          <View style={styles.amountInputRow}>
            <Text style={[styles.amountPrefix, { color: colors.primary }]}>
              {currency === 'NGN' ? '₦' : '$'}
            </Text>
            <TextInput
              value={amount}
              onChangeText={(val) => {
                setAmount(val);
                if (hasError) setHasError(false);
              }}
              placeholder="0.00"
              placeholderTextColor={colors.textLight}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { color: colors.textDark }]}
            />
          </View>
        </View>
      </View>

      {/* 3. Billing Frequency */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          BILLING FREQUENCY
        </Text>
        <View style={styles.cycleGrid}>
          {BILLING_CYCLES.map((c) => {
            const selected = billingCycle === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setBillingCycle(c.id)}
                style={[
                  styles.cyclePill,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cyclePillText,
                    { color: selected ? colors.white : colors.textDark },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. Next Renewal Date */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          NEXT BILLING DATE
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.dateBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.textDark }]}>
            {format(nextBillingDate, 'EEEE, MMMM d, yyyy')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={nextBillingDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* 5. Category (Clean horizontal pill list) */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          CATEGORY
        </Text>
        <View style={styles.categoryWrap}>
          {CATEGORIES.map((cat) => {
            const selected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: selected ? colors.primaryLight : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: selected ? colors.primary : colors.textDark },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 6. Payment Card (Optional) */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          PAYMENT CARD / ACCOUNT (OPTIONAL)
        </Text>
        <TextInput
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder="e.g. GTBank Mastercard, Chipper Dollar Card"
          placeholderTextColor={colors.textLight}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textDark,
            },
          ]}
        />
      </View>

      {/* 7. Renewal Reminder Alert */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          REMIND ME BEFORE RENEWAL
        </Text>
        <View style={styles.cycleGrid}>
          {REMINDER_OPTIONS.map((opt) => {
            const selected = reminderDays === opt.val;
            return (
              <TouchableOpacity
                key={opt.val}
                onPress={() => setReminderDays(opt.val)}
                style={[
                  styles.cyclePill,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cyclePillText,
                    { color: selected ? colors.white : colors.textDark },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 8. Free Trial Toggle */}
      <View
        style={[
          styles.switchCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.switchTitle, { color: colors.textDark }]}>
            Free Trial Mode
          </Text>
          <Text style={[styles.switchSubtitle, { color: colors.textLight }]}>
            Alert me to cancel before trial converts to automatic charge
          </Text>
        </View>
        <Switch
          value={isTrial}
          onValueChange={setIsTrial}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      {/* 9. Personal Notes & Cancel Link */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          CANCEL URL & NOTES (OPTIONAL)
        </Text>
        <TextInput
          value={cancelUrl}
          onChangeText={setCancelUrl}
          placeholder="Cancellation link (https://...)"
          placeholderTextColor={colors.textLight}
          keyboardType="url"
          autoCapitalize="none"
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textDark,
              marginBottom: 10,
            },
          ]}
        />
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Personal notes..."
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={2}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textDark,
              minHeight: 64,
            },
          ]}
        />
      </View>

      {/* 10. Save Action Button */}
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>{submitButtonText}</Text>
      </TouchableOpacity>

      {/* 11. Delete Action Button (If editing) */}
      {isEditing && onDelete && (
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: colors.danger }]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={[styles.deleteBtnText, { color: colors.danger }]}>
            Delete Subscription
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 60,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '700',
  },
  costCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  currencyToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  currencyBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountPrefix: {
    fontSize: 26,
    fontWeight: '900',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '900',
    padding: 0,
  },
  cycleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  cyclePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cyclePillText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '800',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  switchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  switchSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  saveBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
