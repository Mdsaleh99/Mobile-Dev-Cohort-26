import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { MENU_ITEMS } from '../data/menuItems';
import MenuItem from '../components/MenuItem';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const { width } = Dimensions.get('window');
type Category = 'Popular' | 'Starters' | 'Mains';
const CATEGORIES: Category[] = ['Popular', 'Starters', 'Mains'];

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'RestaurantDetail'>;
  route: RouteProp<HomeStackParamList, 'RestaurantDetail'>;
};

export default function RestaurantDetailScreen({ navigation, route }: Props) {
  const { id, name, cuisine, rating, deliveryTime, priceRange, heroImage } = route.params;
  const [activeCategory, setActiveCategory] = useState<Category>('Popular');
  const { addToCart, cartItems, cartTotal } = useApp();

  const menuItems = MENU_ITEMS.filter(
    m => m.restaurantId === id && m.category === activeCategory
  );

  function getQuantity(itemId: string) {
    return cartItems.find(i => i.id === itemId)?.quantity ?? 0;
  }

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image source={heroImage} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoLeft}>
              <Text style={styles.restaurantName}>{name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.rating}>{rating} (420+ reviews)</Text>
              </View>
            </View>
            <Text style={styles.priceRange}>{priceRange}</Text>
          </View>

          <Text style={styles.cuisine}>{cuisine}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{deliveryTime}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>Organic</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.tabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuList}>
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={getQuantity(item.id)}
              onAdd={() => addToCart(item)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {totalCartCount > 0 && (
        <View style={styles.orderBar}>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9}
          >
            <View style={styles.orderBadge}>
              <Text style={styles.orderBadgeText}>{totalCartCount}</Text>
            </View>
            <Text style={styles.orderBtnText}>View Order</Text>
            <Text style={styles.orderBtnPrice}>${cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroWrapper: {
    position: 'relative',
  },
  heroImage: {
    width,
    height: 240,
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  infoCard: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  infoLeft: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  priceRange: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  cuisine: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.sm + 4,
    marginRight: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  menuList: {
    paddingHorizontal: Spacing.lg,
  },
  orderBar: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadow.modal,
  },
  orderBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.full,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  orderBadgeText: {
    color: Colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  orderBtnText: {
    flex: 1,
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  orderBtnPrice: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
