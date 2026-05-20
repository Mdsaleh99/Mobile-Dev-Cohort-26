import React from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import * as ExpoLinking from "expo-linking";
import { AppProvider } from "./src/context/AppContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { RootStackParamList } from "./src/types/navigation";

// Deep linking: foodapp://restaurant/123
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [ExpoLinking.createURL("/")],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              RestaurantDetail: {
                path: "restaurant/:id",
                parse: { id: (id: string) => id },
              },
            },
          },
        },
      },
    },
  },
};

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App

const styles = StyleSheet.create({
  root: { flex: 1 },
});
