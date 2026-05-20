import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Cart'>;
};

const DELIVERY_FEE = 4.50;
const SERVICE_FEE = 3.50;
const TAX_RATE = 0.09;

export default function CartScreen({ navigation }: Props) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();

  const taxes = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + DELIVERY_FEE + SERVICE_FEE + taxes;

  function handlePlaceOrder() {
    Alert.alert(
      'Order Placed!',
      `Your order of $${grandTotal.toFixed(2)} has been confirmed. Estimated delivery: 35-45 min.`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.goBack();
          },
        },
      ]
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some dishes to get started</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.browseBtnText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>DELIVERY ADDRESS</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>123 Culinary Lane, Penthouse 4B</Text>
          <Text style={styles.addressSub}>Leave at front desk, code 8492</Text>

          <View style={styles.confirmedBadge}>
            <Ionicons name="location" size={14} color={Colors.primary} />
            <Text style={styles.confirmedText}>Confirmed</Text>
          </View>
        </View>

        {/* Estimated Delivery */}
        <View style={[styles.card, styles.deliveryRow]}>
          <View style={styles.deliveryIcon}>
            <Ionicons name="time-outline" size={22} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
            <Text style={styles.deliveryTime}>35 – 45 min</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.instructionsRow}>
            <Ionicons name="create-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.instructionsText}>Add special instructions</Text>
          </TouchableOpacity>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentRow}>
            <Ionicons name="card-outline" size={20} color={Colors.text} />
            <View style={styles.paymentInfo}>
              <Text style={styles.cardNumber}>•••• 4242</Text>
              <Text style={styles.cardExpiry}>Expires 12/25</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {[
            { label: 'Subtotal', value: `$${cartTotal.toFixed(2)}` },
            { label: 'Delivery Fee', value: `$${DELIVERY_FEE.toFixed(2)}` },
            { label: 'Service Fee', value: `$${SERVICE_FEE.toFixed(2)}` },
            { label: 'Taxes', value: `$${taxes.toFixed(2)}` },
          ].map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} activeOpacity={0.9}>
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Text style={styles.placeOrderPrice}>${grandTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  browseBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  browseBtnText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 15,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  editText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  addressSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  deliveryIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  deliveryTime: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  orderItemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  placeOrderText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  placeOrderPrice: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
