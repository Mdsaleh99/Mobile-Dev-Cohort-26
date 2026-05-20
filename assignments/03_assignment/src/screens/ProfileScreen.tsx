import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ProfileDrawerParamList } from '../types/navigation';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

type Props = {
  navigation: DrawerNavigationProp<ProfileDrawerParamList, 'Profile'>;
};

type MenuRow = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: keyof ProfileDrawerParamList;
  subtitle?: string;
};

const MENU_ROWS: MenuRow[] = [
  { label: 'My Orders', icon: 'receipt-outline', screen: 'MyOrders', subtitle: '3 past orders' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings', subtitle: 'Preferences & notifications' },
  { label: 'Help & Support', icon: 'help-circle-outline', screen: 'Help', subtitle: 'FAQs & contact us' },
];

export default function ProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.menuToggle} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={44} color={Colors.surface} />
          </View>
          <Text style={styles.name}>Mohammed Saleh</Text>
          <Text style={styles.email}>m.saleh@epicure.com</Text>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '12' },
            { label: 'Favourites', value: '5' },
            { label: 'Reviews', value: '3' },
          ].map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.menuCard}>
          {MENU_ROWS.map((row, idx) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.menuRow, idx < MENU_ROWS.length - 1 && styles.menuRowBorder]}
              onPress={() => navigation.navigate(row.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name={row.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{row.label}</Text>
                {row.subtitle && <Text style={styles.menuSubtitle}>{row.subtitle}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  menuToggle: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  editProfileBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.card,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm + 4,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
