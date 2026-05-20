import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLinkTo } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { RESTAURANTS, Restaurant } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Colors, Spacing, Radius } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};

const FILTERS = ['All', 'Artisan & Tasting', 'Farm-to-Table', 'Plant-Based'];

export default function HomeScreen({ navigation }: Props) {
  const linkTo = useLinkTo();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = RESTAURANTS.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      r.cuisine.toLowerCase().includes(activeFilter.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  function testDeepLink() {
    // useLinkTo uses the linking config path directly — works in any environment
    // Equivalent to opening: foodapp://restaurant/1
    linkTo('/restaurant/1');
  }

  function goToRestaurant(restaurant: Restaurant) {
    navigation.navigate('RestaurantDetail', {
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      priceRange: restaurant.priceRange,
      heroImage: restaurant.heroImage,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Discover the{'\n'}extraordinary.</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.deepLinkBtn} onPress={testDeepLink}>
              <Ionicons name="link-outline" size={14} color={Colors.primary} />
              <Text style={styles.deepLinkText}>Deep Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn}>
              <Ionicons name="person-circle-outline" size={32} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Dishes, chefs, or dietary needs..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated for you</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No restaurants found.</Text>
        ) : (
          filtered.map(r => (
            <RestaurantCard key={r.id} restaurant={r} onPress={() => goToRestaurant(r)} />
          ))
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 36,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  avatarBtn: {
    marginTop: 4,
  },
  deepLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  deepLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  filtersRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    fontSize: 15,
  },
});
