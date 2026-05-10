import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Button,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Entypo, EvilIcons, Ionicons } from "@expo/vector-icons";

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Image
                source={require("@/assets/images/app-logo.png")}
                width={100}
                height={100}
            />

            <Text style={styles.heading}>Sign In</Text>

            <Text style={styles.subHeading}>
                Let's experience the joy of AI
            </Text>

            <KeyboardAvoidingView>
                <Text style={{ marginTop: 50 }}>Email Address</Text>
                <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={"#666"}
                    style={styles.textInput}
                />
                <Text style={{ marginTop: 25 }}>Password</Text>
                <TextInput
                    placeholder="Enter your Password"
                    placeholderTextColor={"#666"}
                    style={styles.textInput}
                />
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#278136" : "#109e28",
                        padding: 15,
                        borderRadius: 20,
                        alignItems: "center",
                        marginTop: 35,
                    })}
                    hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: 20,
                        right: 20,
                    }}
                >
                    {({ pressed }) =>
                        pressed ? (
                            <Text>Signing in...</Text>
                        ) : (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <Text style={{ color: "white" }}>Sign In</Text>
                                <Ionicons
                                    name="arrow-forward-outline"
                                    style={{ color: "white" }}
                                    size={15}
                                />
                            </View>
                        )
                    }
                </Pressable>
            </KeyboardAvoidingView>
            <View style={styles.iconsContainer}>
                <View style={styles.iconStyle}>
                    <EvilIcons name="sc-facebook" size={40} color="black" />
                </View>
                <View style={styles.iconStyle}>
                    <AntDesign name="google" size={24} color="black" />
                </View>
                <View style={styles.iconStyle}>
                    <Entypo name="instagram" size={24} color="black" />
                </View>
            </View>
            <View
                style={{
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Text>
                    Don't have an account?{" "}
                    <Text style={styles.hightlightText}>Sign Up</Text>
                </Text>
                <Text style={styles.hightlightText}>Forgot your password?</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 60,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    subHeading: {
        fontSize: 12,
        color: "#666",
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#109e28",
        marginTop: 5,
        // marginBottom: 30,
        fontSize: 16,
        width: 300,
        padding: 10,
        borderRadius: 20,
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        marginTop: 30,
        marginBottom: 30,
    },
    iconStyle: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#ddd",
        borderWidth: 2,
        borderRadius: 15,
    },
    hightlightText: {
        color: "#109e28",
        textDecorationLine: "underline",
        fontWeight: "bold",
    },
});
