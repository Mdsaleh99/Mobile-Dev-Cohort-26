import { useLightSensor } from "@/hooks/use-light-sensor";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Bar is full when lux reaches this value (adjust if needed)
const MAX_LUX_FOR_BAR = 500;

export function LightMeter() {
  const insets = useSafeAreaInsets();
  const { available, lux } = useLightSensor();

  const barWidth = Math.min((lux / MAX_LUX_FOR_BAR) * 100, 100);
  const label = getLightLabel(lux);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Light sensor</Text>
      <Text style={styles.subtitle}>
        Cover the front sensor or shine a light — watch lux change.
      </Text>

      {Platform.OS !== "android" && (
        <Text style={styles.warning}>
          Light sensor is only available on Android in Expo.
        </Text>
      )}

      <View style={styles.sensorBox}>
        <Text style={styles.sensorTitle}>Illuminance (lux)</Text>
        <Text style={styles.luxValue}>{lux.toFixed(1)} lx</Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      {available === false && Platform.OS === "android" && (
        <Text style={styles.warning}>Light sensor not available on this device.</Text>
      )}

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${barWidth}%` }]} />
      </View>

      <Text style={styles.footer}>
        Bar width = lux ÷ {MAX_LUX_FOR_BAR} × 100 (capped at 100%)
      </Text>
    </View>
  );
}

function getLightLabel(lux: number) {
  if (lux < 10) return "Dark";
  if (lux < 100) return "Dim";
  if (lux < 500) return "Indoor light";
  return "Bright";
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0c0a09",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: "#fafaf9",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#a8a29e",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  sensorBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1c1917",
    borderWidth: 1,
    borderColor: "#292524",
    alignItems: "center",
  },
  sensorTitle: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  luxValue: {
    color: "#fef3c7",
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  label: {
    color: "#d6d3d1",
    fontSize: 18,
    marginTop: 8,
  },
  warning: {
    color: "#fbbf24",
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  barTrack: {
    marginTop: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#292524",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 16,
  },
  footer: {
    color: "#78716c",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});
