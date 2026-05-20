import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const PAST_ORDERS = [
  {
    id: 'o1',
    restaurant: 'Lumina Brasserie',
    items: 'Wild Mushroom Tagliatelle, Burrata',
    total: '$64.50',
    date: 'May 18, 2026',
    status: 'Delivered',
  },
  {
    id: 'o2',
    restaurant: 'Osteria Verde',
    items: 'Truffle Risotto, Tartare',
    total: '$88.00',
    date: 'May 15, 2026',
    status: 'Delivered',
  },
  {
    id: 'o3',
    restaurant: 'Botanica',
    items: 'Harvest Grain Bowl, Burrata & Stone Fruit',
    total: '$44.00',
    date: 'May 10, 2026',
    status: 'Delivered',
  },
];

export default function OrdersScreen() {
  const { cartItems, cartTotal } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Orders</Text>

        {cartItems.length > 0 && (
          <View style={styles.activeSection}>
            <Text style={styles.sectionLabel}>Active Order</Text>
            <View style={styles.activeCard}>
              <View style={styles.activeRow}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Order in progress</Text>
              </View>
              <Text style={styles.activeItems}>
                {cartItems.map(i => i.name).join(', ')}
              </Text>
              <View style={styles.activeFooter}>
                <Text style={styles.activeTotal}>${cartTotal.toFixed(2)}</Text>
                <View style={styles.trackingBadge}>
                  <Text style={styles.trackingText}>35–45 min</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>Past Orders</Text>
        {PAST_ORDERS.map(order => (
          <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.85}>
            <View style={styles.orderRow}>
              <View style={styles.orderIcon}>
                <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderRestaurant}>{order.restaurant}</Text>
                <Text style={styles.orderItems} numberOfLines={1}>{order.items}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>{order.total}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  activeSection: {
    marginBottom: Spacing.lg,
  },
  activeCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: '#4ADE80',
  },
  activeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  activeItems: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.surface,
    marginBottom: Spacing.md,
  },
  activeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.surface,
  },
  trackingBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  trackingText: {
    fontSize: 12,
    color: Colors.surface,
    fontWeight: '500',
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderRestaurant: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
});
