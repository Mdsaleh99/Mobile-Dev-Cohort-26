import {
  COOLDOWN_MS,
  SHAKE_THRESHOLD,
  useShakeDetection,
} from "@/hooks/use-shake-detection";

import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ShakeDetector() {
  const insets = useSafeAreaInsets();
  const { available, force, isShaking, shakeCount } = useShakeDetection();
  const [sheetOpen, setSheetOpen] = useState(false);



  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Shake detector</Text>
      <Text style={styles.subtitle}>Shake the device firmly to trigger it.</Text>

      <View style={[styles.hero, isShaking && styles.heroActive]}>
        <Text style={styles.heroEmoji}>{isShaking ? "📳" : "📱"}</Text>
        <Text style={styles.heroLabel}>
          {isShaking ? "Shaking!" : "Shake to detect"}
        </Text>
        <Text style={styles.heroHint}>
          force {force.toFixed(1)} / {SHAKE_THRESHOLD} · {shakeCount} shakes
        </Text>
      </View>

      {available === false && (
        <Text style={styles.warning}>DeviceMotion not available.</Text>
      )}

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.sheetEmoji}>📳</Text>
            <Text style={styles.sheetTitle}>Shake detected</Text>
            <Text style={styles.sheetSubtitle}>
              {COOLDOWN_MS}ms cooldown between shakes.
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => setSheetOpen(false)}
            >
              <Text style={styles.buttonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
  },
  title: {
    color: "#fafafa",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#a1a1aa",
    fontSize: 14,
    marginTop: 6,
  },
  hero: {
    marginTop: 24,
    paddingVertical: 36,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#27272a",
    borderColor: "#52525b",
  },
  heroActive: {
    backgroundColor: "#4c1d95",
    borderColor: "#a78bfa",
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroLabel: {
    color: "#fafafa",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  heroHint: {
    color: "#d4d4d8",
    fontSize: 13,
    marginTop: 8,
    fontFamily: "monospace",
  },
  warning: {
    color: "#fbbf24",
    marginTop: 12,
    fontSize: 13,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  sheet: {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
  },
  sheetEmoji: {
    fontSize: 44,
  },
  sheetTitle: {
    color: "#18181b",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  sheetSubtitle: {
    color: "#71717a",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    alignSelf: "stretch",
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "700",
  },
});
