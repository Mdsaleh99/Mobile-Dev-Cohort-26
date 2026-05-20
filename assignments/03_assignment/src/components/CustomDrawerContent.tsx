import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, Radius } from '../constants/theme';

type DrawerItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen?: string;
  onPress?: () => void;
};

export default function CustomDrawerContent(props: any) {
  const { setIsAuthenticated, clearCart } = useApp();
  const navigation = useNavigation<any>();

  function handleLogout() {
    clearCart();
    setIsAuthenticated(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  }

  const items: DrawerItem[] = [
    { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
    { label: 'My Orders', icon: 'receipt-outline', screen: 'MyOrders' },
    { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { label: 'Help', icon: 'help-circle-outline', screen: 'Help' },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={Colors.surface} />
        </View>
        <Text style={styles.name}>Mohammed Saleh</Text>
        <Text style={styles.email}>m.saleh@epicure.com</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.menu}>
        {items.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => item.screen && props.navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={20} color={Colors.textSecondary} />
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.xl,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.surface,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  menu: {
    paddingHorizontal: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.error,
  },
});
