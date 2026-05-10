import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// this status bar is from react native
export default function StatusBarOne()  {
    const insets = useSafeAreaInsets();

    console.log(insets);
    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top - 12,
                paddingBottom: insets.bottom,
            }}
        >
            <StatusBar barStyle={"default"} />
            <Text>HomeScreen</Text>
        </View>
    );
};
