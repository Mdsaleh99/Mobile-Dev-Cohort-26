import { useMagnetometer } from "@/hooks/use-magnetometer";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COMPASS_SIZE = 260;

export function Compass() {
  const insets = useSafeAreaInsets();
  const { available, x, y, z, heading } = useMagnetometer();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Compass</Text>
      <Text style={styles.subtitle}>
        Hold the phone flat. Rotate your body — the needle points north using
        magnetometer x and y.
      </Text>

      <View style={styles.sensorBox}>
        <Text style={styles.sensorTitle}>Magnetometer (μT)</Text>
        <Text style={styles.sensorLine}>x: {x.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>y: {y.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>z: {z.toFixed(2)}</Text>
      </View>

      <Text style={styles.heading}>{Math.round(heading)}°</Text>

      {available === false && (
        <Text style={styles.warning}>Magnetometer not available.</Text>
      )}

      <View style={styles.stage}>
        <View style={styles.compassRing}>
          <Text style={[styles.mark, styles.markNorth]}>N</Text>
          <Text style={[styles.mark, styles.markEast]}>E</Text>
          <Text style={[styles.mark, styles.markSouth]}>S</Text>
          <Text style={[styles.mark, styles.markWest]}>W</Text>

          <View
            style={[
              styles.needle,
              { transform: [{ rotate: `${-heading}deg` }] },
            ]}
          >
            <View style={styles.needleRed} />
            <View style={styles.needleWhite} />
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Needle rotation = -heading, where heading comes from atan2(x, y)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07131f",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: "#ecfeff",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  sensorBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#0f2a3d",
    borderWidth: 1,
    borderColor: "#1e3a4a",
  },
  sensorTitle: {
    color: "#22d3ee",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  sensorLine: {
    color: "#e2e8f0",
    fontSize: 18,
    fontFamily: "monospace",
  },
  heading: {
    color: "#22d3ee",
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
  warning: {
    color: "#fbbf24",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    borderColor: "#164e63",
    backgroundColor: "#0b2230",
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    position: "absolute",
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 16,
  },
  markNorth: {
    top: 14,
    color: "#f87171",
  },
  markEast: {
    right: 16,
  },
  markSouth: {
    bottom: 14,
  },
  markWest: {
    left: 16,
  },
  needle: {
    width: 20,
    height: COMPASS_SIZE - 80,
    alignItems: "center",
  },
  needleRed: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ef4444",
  },
  needleWhite: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#e2e8f0",
  },
  footer: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});
