import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeScreen() {
    return (
        <SafeAreaView
            edges={["bottom", "top"]}
            style={{ flex: 1, backgroundColor: "#1c1c1e" }}
        >
            <Text style={{ color: "#fff", fontSize: 18, padding: 16 }}>
                Header (safely below notch ✅)
            </Text>
            <Text style={{ color: "#aaa", padding: 16 }}>
                This content respects the safe area on all devices.
            </Text>
        </SafeAreaView>
    );
}
