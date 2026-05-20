import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RESTAURANTS, Restaurant } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Colors, Spacing, Radius } from '../constants/theme';
import { HomeStackParamList } from '../types/navigation';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const results = query.trim().length > 0
    ? RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

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
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find restaurants, dishes, and more</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Restaurants, cuisine, dietary..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
        />
        {query.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={Colors.textMuted}
            onPress={() => setQuery('')}
          />
        )}
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.placeholder}>
          <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.placeholderText}>Start typing to discover restaurants</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.placeholder}>
          <Ionicons name="sad-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.placeholderText}>No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={r => r.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={() => goToRestaurant(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  placeholderText: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
