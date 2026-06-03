import { ShakeDetector } from "@/components/shake-detector";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function Index() {



  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ShakeDetector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
  },
});
