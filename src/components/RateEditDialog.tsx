import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  visible: boolean;
  currentRate: number;
  onDismiss: () => void;
  onSave: (newRate: number) => void;
}

export const RateEditDialog: React.FC<Props> = ({
  visible,
  currentRate,
  onDismiss,
  onSave,
}) => {
  const { colors } = useTheme();
  const [rateText, setRateText] = useState(currentRate.toString());

  // Keep rate in sync when dialog opens
  useEffect(() => {
    if (visible) {
      setRateText(currentRate ? currentRate.toString() : '1550');
    }
  }, [visible, currentRate]);

  const handleSave = () => {
    const parsed = parseFloat(rateText);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textDark }]}>
              Exchange Rate
            </Text>
            <TouchableOpacity onPress={onDismiss}>
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Conversion rate for $ subscriptions into your total Naira spend:
          </Text>

          {/* Clean Input */}
          <Text style={[styles.inputLabel, { color: colors.textLight }]}>
            1 USD IN NAIRA (₦)
          </Text>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.currencyPrefix, { color: colors.primary }]}>
              ₦
            </Text>
            <TextInput
              value={rateText}
              onChangeText={setRateText}
              keyboardType="decimal-pad"
              placeholder="e.g. 1550"
              placeholderTextColor={colors.textLight}
              style={[styles.input, { color: colors.textDark }]}
              autoFocus={visible}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, { color: colors.textDark }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, { color: colors.white }]}>
                Save Rate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '900',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
