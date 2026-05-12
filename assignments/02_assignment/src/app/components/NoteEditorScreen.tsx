import { StatusBar } from "expo-status-bar";
import {
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NoteEditorScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView>
                <Text style={styles.heading}>Note Editor Screen</Text>
                <TextInput
                    placeholder="Enter note title"
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 16,
                        marginBottom: 20,
                    }}
                />
                <TextInput
                    placeholder="Enter note description"
                    multiline={true}
                    maxLength={800}
                    numberOfLines={10}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 16,
                        marginBottom: 20,
                    }}
                />
            </KeyboardAvoidingView>
            <View style={styles.btnContainer}>
                <Pressable
                    style={[styles.button, styles.backButton]}
                    onPress={() => alert("Go Back")}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.saveButton]}
                    onPress={() => alert("Save Note")}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default NoteEditorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    heading: {
        marginBottom: 20,
        fontSize: 24,
        fontWeight: "bold",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: "#2563eb",
    },
    backButton: {
        backgroundColor: "#6b7280",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
