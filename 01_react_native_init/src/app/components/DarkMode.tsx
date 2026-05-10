import React, { useState } from "react";
import {
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

const DarkMode = () => {
    const items = Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);
    const [isDarkMode, setIsDarkMode] = useState(false);

    console.log("hello");
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                padding: 16,
                alignItems: "center",
            }}
        >
            {items.map((item) => (
                <View
                    key={item}
                    style={{
                        backgroundColor: "white",
                        padding: 16,
                        borderRadius: 10,
                        marginBottom: 10,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                </View>
            ))}

            <Button
                title="Hello i am button"
                color={"green"}
                onPress={() => alert("Hello world")}
            />
            <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#ddd", true: "#6c63ff" }}
                thumbColor={"yellow"}
            />
        </ScrollView>
    );
};

export default DarkMode;

const styles = StyleSheet.create({});
