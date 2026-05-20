import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

const ORDERS = [
  { id: '1', restaurant: 'Lumina Brasserie', items: 'Tagliatelle, Burrata', total: '$64.50', date: 'May 18, 2026' },
  { id: '2', restaurant: 'Osteria Verde', items: 'Truffle Risotto, Tartare', total: '$88.00', date: 'May 15, 2026' },
  { id: '3', restaurant: 'Botanica', items: 'Harvest Bowl', total: '$44.00', date: 'May 10, 2026' },
];

export default function MyOrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>My Orders</Text>
        {ORDERS.map(order => (
          <TouchableOpacity key={order.id} style={styles.card} activeOpacity={0.85}>
            <View style={styles.row}>
              <View style={styles.icon}>
                <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.restaurant}>{order.restaurant}</Text>
                <Text style={styles.items}>{order.items}</Text>
                <Text style={styles.date}>{order.date}</Text>
              </View>
              <Text style={styles.total}>{order.total}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  icon: {
    width: 44, height: 44, borderRadius: Radius.full,
    backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1 },
  restaurant: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  items: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  date: { fontSize: 11, color: Colors.textMuted },
  total: { fontSize: 15, fontWeight: '700', color: Colors.text },
});
