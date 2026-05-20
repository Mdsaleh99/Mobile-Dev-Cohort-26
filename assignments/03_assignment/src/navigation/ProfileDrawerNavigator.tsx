import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ProfileDrawerParamList } from '../types/navigation';
import ProfileScreen from '../screens/ProfileScreen';
import MyOrdersScreen from '../screens/drawer/MyOrdersScreen';
import SettingsScreen from '../screens/drawer/SettingsScreen';
import HelpScreen from '../screens/drawer/HelpScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Colors } from '../constants/theme';

const Drawer = createDrawerNavigator<ProfileDrawerParamList>();

export default function ProfileDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.textSecondary,
        drawerActiveBackgroundColor: '#ECFDF5',
        drawerStyle: { backgroundColor: Colors.surface, width: 300 },
        drawerLabelStyle: { fontSize: 15, fontWeight: '500' },
        overlayColor: Colors.overlay,
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerLabel: 'Profile', drawerIcon: () => null }}
      />
      <Drawer.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{ drawerLabel: 'My Orders', drawerIcon: () => null }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerLabel: 'Settings', drawerIcon: () => null }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ drawerLabel: 'Help', drawerIcon: () => null }}
      />
    </Drawer.Navigator>
  );
}
