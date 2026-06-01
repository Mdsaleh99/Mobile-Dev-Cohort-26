import { Text, View, StyleSheet } from "react-native";

interface AccelerometerDisplayProps {
  x: number;
  y: number;
  z: number;
  magnitude?: number;
  intensity?: number;
  showAdvanced?: boolean;
}

export function AccelerometerDisplay({
  x,
  y,
  z,
  magnitude = 0,
  intensity = 0,
  showAdvanced = true,
}: AccelerometerDisplayProps) {
  return (
    <View style={styles.sensorBox}>
      <Text style={styles.sensorTitle}>Accelerometer (g)</Text>
      <View style={styles.dataGrid}>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>X</Text>
          <Text style={styles.dataValue}>{x.toFixed(2)}</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Y</Text>
          <Text style={styles.dataValue}>{y.toFixed(2)}</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Z</Text>
          <Text style={styles.dataValue}>{z.toFixed(2)}</Text>
        </View>
      </View>

      {showAdvanced && (
        <>
          <View style={styles.advancedData}>
            <View style={styles.advancedItem}>
              <Text style={styles.advancedLabel}>Magnitude</Text>
              <Text style={styles.advancedValue}>{magnitude.toFixed(2)}g</Text>
            </View>
            <View style={styles.advancedItem}>
              <Text style={styles.advancedLabel}>Intensity</Text>
              <Text style={styles.advancedValue}>{intensity.toFixed(0)}%</Text>
            </View>
          </View>

          <View style={styles.intensityBar}>
            <View
              style={[
                styles.intensityFill,
                {
                  width: `${intensity}%`,
                  backgroundColor:
                    intensity < 33 ? "#10b981" : intensity < 66 ? "#f59e0b" : "#ef4444",
                },
              ]}
            />
          </View>
        </>
      )}

      <Text style={styles.sensorHint}>
        📱 Flat on table → z ≈ 1. Tilt left/right → x changes. Tilt forward/back → y
        changes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sensorBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  sensorTitle: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  dataGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  dataItem: {
    alignItems: "center",
  },
  dataLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  dataValue: {
    color: "#e2e8f0",
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  advancedData: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
  },
  advancedItem: {
    alignItems: "center",
  },
  advancedLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  advancedValue: {
    color: "#22d3ee",
    fontSize: 14,
    fontWeight: "700",
  },
  intensityBar: {
    height: 6,
    backgroundColor: "#0f172a",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  intensityFill: {
    height: "100%",
    borderRadius: 3,
  },
  sensorHint: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 16,
  },
});
