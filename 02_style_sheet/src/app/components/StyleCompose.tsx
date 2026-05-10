import React from "react";
import { StyleSheet, StyleProp, Text, View, ViewStyle } from "react-native";

const StyleCompose = () => {
    const isActive = true;

    const buttonStyle: StyleProp<ViewStyle> = StyleSheet.compose(
        styles.button,
        isActive ? styles.activeButton : null,
    );

    return (
        <View style={styles.container}>
            {/* @ts_ignore */}
            <View style={buttonStyle}>
                <Text style={styles.buttonText}>Composed Style</Text>
            </View>
        </View>
    );
};

export default StyleCompose;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        backgroundColor: "#ccc", // Default grey
    },
    activeButton: {
        backgroundColor: "#6C63FF", // Override to purple when active
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
