import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import NotesListingScreen from "./components/NotesListingScreen";
import NoteEditorScreen from "./components/NoteEditorScreen";

export default function Index() {
    return (
        <NotesListingScreen />
        // <NoteEditorScreen />
        // <View style={styles.container}>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
