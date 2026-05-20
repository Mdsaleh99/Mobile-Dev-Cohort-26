import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileDrawerNavigator from './ProfileDrawerNavigator';
import { useApp } from '../context/AppContext';
import { Colors, Radius } from '../constants/theme';

const HIDDEN_TAB_SCREENS = ['RestaurantDetail', 'Cart'];

function getTabBarStyle(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName && HIDDEN_TAB_SCREENS.includes(routeName)) {
    return { display: 'none' as const };
  }
  return styles.tabBar;
}

const Tab = createBottomTabNavigator<MainTabParamList>();

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={badge.container}>
      <Text style={badge.text}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.badge,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default function MainNavigator() {
  const { cartItems } = useApp();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: getTabBarStyle(route),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            HomeTab: ['home', 'home-outline'],
            SearchTab: ['search', 'search-outline'],
            OrdersTab: ['bag', 'bag-outline'],
            ProfileTab: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          const iconName = focused ? active : inactive;

          if (route.name === 'OrdersTab') {
            return (
              <View>
                <Ionicons name={iconName as any} size={size} color={color} />
                <CartBadge count={cartCount} />
              </View>
            );
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="OrdersTab" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="ProfileTab" component={ProfileDrawerNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
