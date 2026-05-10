import React from "react";
import { StyleSheet, Text } from "react-native";

const styleA = StyleSheet.create({ text: { color: "red", fontSize: 16 } });
const styleB = StyleSheet.create({
    text: { fontSize: 24, fontWeight: "bold" },
});

const flat = StyleSheet.flatten([styleA.text, styleB.text]);

const FlattenStyle = () => {
    return <Text style={flat}>Flattened Style!</Text>;
};

export default FlattenStyle;
