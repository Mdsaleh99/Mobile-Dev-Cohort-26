import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// https://docs.expo.dev/versions/latest/sdk/securestore/

export default function Index() {
    const [data, setData] = useState("");

    const [output, setOutput] = useState<string>("");

    const saveToken = async () => {
        await SecureStore.setItemAsync("token", "abc123xyz");
        setOutput("Token Saved");
    };

    const getToken = async () => {
        const value = await SecureStore.getItemAsync("token");
        setOutput(value!);
    };

    const deleteToken = async () => {
        await SecureStore.deleteItemAsync("token");

        setOutput("Token deleted");
    };

    const checkAvailability = async () => {
        const available = await SecureStore.isAvailableAsync();

        setOutput(
            available ? "SecureStore Available" : "SecureStore Not Available",
        );
    };

    const saveObject = async () => {
        const user = {
            name: "Code Snippet",
            role: "Admin",
        };
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        setOutput("Object Saved");
    };

    const getObject = async () => {
        const data = await SecureStore.getItemAsync("user");

        if (!data) {
            setOutput("No User Found");
            return;
        }

        const parsed = JSON.parse(data);

        setOutput(`${parsed.name} - ${parsed.role}`);
    };
    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                padding: 20,
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    gap: 12,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        marginBottom: 10,
                    }}
                >
                    SecureStore Demo
                </Text>

                <Button title="Save Token" onPress={saveToken} />
                <Button title="Get Token" onPress={getToken} />
                <Button title="Delete Token" onPress={deleteToken} />
                <Button
                    title="Check Availability"
                    onPress={checkAvailability}
                />
                <Button title="Save Object" onPress={saveObject} />
                <Button title="Get Object" onPress={getObject} />

                <View
                    style={{
                        marginTop: 30,
                        padding: 20,
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 10,
                        }}
                    >
                        Output
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                        }}
                    >
                        {output}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}
