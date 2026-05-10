import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function KeyboardAvoidView() {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={{ flex: 1, justifyContent: "flex-end", padding: 24 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 24,
                    }}
                >
                    Login
                </Text>

                <TextInput
                    placeholder="Email"
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 16,
                        marginBottom: 20,
                    }}
                />
                <Pressable
                    style={{
                        backgroundColor: "#6C63FF",
                        padding: 16,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                    >
                        Sign In
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
