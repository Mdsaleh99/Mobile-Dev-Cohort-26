import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notes } from "../utils/data";

const themes = {
    light: {
        background: "#FFFFFF",
        card: "#F5F5F5",
        text: "#1A1A1A",
        subtext: "#666666",
        accent: "#167c3a",
    },
    dark: {
        background: "#121212",
        card: "#1E1E1E",
        text: "#FFFFFF",
        subtext: "#AAAAAA",
        accent: "#2f8e28",
    },
};

const NotesListingScreen = () => {
    const systemScheme = useColorScheme();
    // console.log(systemScheme); // dark
    const [manualDark, setManualDark] = useState<boolean | null>(null);
    const isDark = manualDark !== null ? manualDark : systemScheme === "dark";
    const [search, setSearch] = useState("");

    const filteredNotes = notes.filter((note) => (
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase())
    ))

    const theme = isDark ? themes.dark : themes.light;

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <StatusBar style={manualDark ? "light" : "light"} />
            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.title, { color: theme.text }]}>
                    {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </Text>
                <Switch
                    value={manualDark ?? systemScheme === "dark"}
                    onValueChange={setManualDark}
                    trackColor={{ false: "#ddd", true: theme.accent }}
                    thumbColor="white"
                />
            </View>
            <KeyboardAvoidingView>
                <TextInput
                    placeholder="Search notes..."
                    onChangeText={setSearch}
                    value={search}
                    style={{
                        borderWidth: 1,
                        borderColor: theme.accent,
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 16,
                        marginBottom: 20,
                        marginHorizontal: 15,
                        color: "black",
                        backgroundColor: "white",
                    }}
                />
            </KeyboardAvoidingView>
            <View>
                <FlatList
                    style={{ backgroundColor: theme.background }}
                    data={filteredNotes}
                    keyExtractor={(note) => note.id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() =>
                                alert(`${item.title} \n\n${item.description}`)
                            }
                        >
                            <View
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: theme.card,
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.title,
                                        { color: theme.text },
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    numberOfLines={3}
                                    style={[
                                        styles.subtitle,
                                        { color: theme.subtext },
                                    ]}
                                >
                                    {item.description}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontSize: 12,
                                        color: theme.accent,
                                    }}
                                >
                                    {item.date}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    // ItemSeparatorComponent={() => (
                    //     <View style={{ height: 1, backgroundColor: "black" }} />
                    // )}
                    contentContainerStyle={{ paddingBottom: 190 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default NotesListingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        padding: 15,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 15,
    },
    title: { fontSize: 20, fontWeight: "bold" },
    subtitle: { fontSize: 14, marginTop: 4 },
    label: { fontSize: 16 },
});
