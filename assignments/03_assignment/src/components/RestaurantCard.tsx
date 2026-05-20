import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../data/restaurants';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

type Props = {
  restaurant: Restaurant;
  onPress: () => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={restaurant.cardImage} style={styles.image} />
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>

        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

        <View style={styles.tagRow}>
          {restaurant.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
          </View>
          <Text style={styles.price}>{restaurant.priceRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: Radius.xl,
  },
  heartBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 6,
  },
  body: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  cuisine: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
