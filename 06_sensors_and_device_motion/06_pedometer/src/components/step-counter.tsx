import { usePedometer } from "@/hooks/use-pedometer";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StepCounter() {
  const insets = useSafeAreaInsets();
  const { available, permission, steps, listening, listenError, requestPermission, startListening, isAndroid } = usePedometer();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Step Counter</Text>

      <View style={styles.stepsBox}>
        <Text style={styles.stepsLabel}>Steps</Text>
        <Text style={styles.stepsValue}>{steps}</Text>
      </View>

      {isAndroid && permission && !permission.granted && (
        <Text style={styles.warning}>Permission needed for Android</Text>
      )}

      {isAndroid && (
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Request Permission</Text>
        </Pressable>
      )}

      {!listening && available && (
        <Pressable style={styles.button} onPress={startListening}>
          <Text style={styles.buttonText}>Start Counting</Text>
        </Pressable>
      )}

      {listening && <Text style={styles.info}>Counting steps...</Text>}
      {listenError && <Text style={styles.warning}>{listenError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "700",
  },
  stepsBox: {
    marginTop: 16,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  stepsLabel: {
    color: "#64748b",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stepsValue: {
    color: "#4ade80",
    fontSize: 56,
    fontWeight: "700",
    marginTop: 8,
    fontFamily: "monospace",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  warning: {
    color: "#fbbf24",
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
  },
  info: {
    color: "#4ade80",
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});
