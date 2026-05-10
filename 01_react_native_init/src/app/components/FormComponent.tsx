import React, { useState } from "react";
import {
    Button,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

// TextInput Example
export const TextInputExample = () => {
    const [name, setName] = useState("");
    return (
        <TextInput
            placeholder="enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={"blue"}
            style={{
                borderWidth: 1,
                borderColor: "#ddd",
                marginTop: 10,
                fontSize: 24,
            }}
        />
    );
};

// Pressable/Button Example
export const ButtonExample = () => {
    return (
        <Pressable
            onPress={() => alert("Button Pressed")}
            style={({ pressed }) => ({
                backgroundColor: pressed ? "#4a42d4" : "#6C63FF",
            })}
            hitSlop={{
                top: 10,
                bottom: 10,
                left: 20,
                right: 20,
            }}
        >
            {({ pressed }) =>
                pressed ? <Text>Pressing...</Text> : <Text>Press me</Text>
            }
        </Pressable>
    );
};
