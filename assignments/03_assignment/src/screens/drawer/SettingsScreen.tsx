import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

type SettingRow = {
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  toggle?: boolean;
};

const SETTINGS: SettingRow[] = [
  { label: 'Push Notifications', subtitle: 'Order updates and offers', icon: 'notifications-outline', toggle: true },
  { label: 'Email Notifications', subtitle: 'Receipts and promotions', icon: 'mail-outline', toggle: true },
  { label: 'Location Services', subtitle: 'For accurate delivery', icon: 'location-outline', toggle: true },
  { label: 'Dark Mode', subtitle: 'Switch app appearance', icon: 'moon-outline', toggle: true },
];

export default function SettingsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Push Notifications': true,
    'Email Notifications': true,
    'Location Services': true,
    'Dark Mode': false,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          {SETTINGS.map((s, idx) => (
            <View key={s.label} style={[styles.row, idx < SETTINGS.length - 1 && styles.rowBorder]}>
              <View style={styles.iconWrapper}>
                <Ionicons name={s.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{s.label}</Text>
                <Text style={styles.subtitle}>{s.subtitle}</Text>
              </View>
              <Switch
                value={toggles[s.label]}
                onValueChange={v => setToggles(p => ({ ...p, [s.label]: v }))}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>
          ))}
        </View>

        <View style={[styles.card, { marginTop: Spacing.md }]}>
          {['Payment Methods', 'Delivery Addresses', 'Language'].map((item, idx) => (
            <TouchableOpacity key={item} style={[styles.row, idx < 2 && styles.rowBorder]} activeOpacity={0.7}>
              <Text style={styles.label}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconWrapper: {
    width: 36, height: 36, borderRadius: Radius.sm + 4,
    backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500', color: Colors.text },
  subtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
});
