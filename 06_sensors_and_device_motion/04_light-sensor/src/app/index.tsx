import { LightMeter } from "@/components/light-meter";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LightMeter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0a09",
  },
});
