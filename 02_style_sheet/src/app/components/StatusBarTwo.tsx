import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// this status bar is from expo

const StatusBarTwo = () => {
    return (
        <SafeAreaView>
            <View style={styles.card}>
                <StatusBar style="light" />
                <Text style={styles.title}>StatusBarTwo</Text>
                <Text style={styles.subtitle}>hello</Text>
            </View>
        </SafeAreaView>
    );
};

export default StatusBarTwo;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        margin: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
});
