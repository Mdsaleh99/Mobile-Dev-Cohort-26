import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import StaticDrawer from './src/navigator/drawer/StaticDrawer';
import DynamicDrawer from './src/navigator/drawer/DynamicDrawer';

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Home Screen</Text>
    </View>
  );
}

function ReelsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Reels Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <DynamicDrawer/>
  );
}