import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const USERS = [
    { id: "1", name: "Alice Johnson", role: "Designer" },
    { id: "2", name: "Bob Smith", role: "Developer" },
    { id: "3", name: "Carol White", role: "Manager" },
    { id: "4", name: "David Brown", role: "Developer" },
    { id: "5", name: "Eve Davis", role: "Designer" },
];

const FlatListExample = () => {
    return (
        <FlatList
            style={{
                backgroundColor: "red",
            }}
            data={USERS}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, backgroundColor: "green" }}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "black" }} />
            )}
        />
    );
};

export default FlatListExample;

const styles = StyleSheet.create({});
