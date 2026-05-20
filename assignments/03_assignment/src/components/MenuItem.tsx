import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem as MenuItemType } from '../data/menuItems';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

type Props = {
  item: MenuItemType;
  onAdd: () => void;
  quantity: number;
};

export default function MenuItem({ item, onAdd, quantity }: Props) {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
            {quantity > 0 ? (
              <Text style={styles.addBtnText}>{quantity} ✓</Text>
            ) : (
              <Ionicons name="add" size={20} color={Colors.surface} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  body: {
    flex: 1,
    padding: Spacing.sm + 4,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.surface,
    fontSize: 11,
    fontWeight: '700',
  },
});
