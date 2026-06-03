import { StyleSheet, View } from "react-native";
import { formatSensorValue } from "@/lib/formatters";
import { SensorAvailability, SensorSnapshot } from "@/types/drive";
import { AppText } from "./AppText";
import { Card } from "./Card";

type SensorStatusCardProps = {
  availability: SensorAvailability;
  snapshot: SensorSnapshot;
};

function formatAvailability(value: boolean | null) {
  if (value === null) {
    return "Not checked";
  }

  return value ? "Available" : "Unavailable";
}

export function SensorStatusCard({ availability, snapshot }: SensorStatusCardProps) {
  return (
    <Card>
      <AppText style={styles.title}>Sensor Status</AppText>
      <View style={styles.grid}>
        <SensorRow
          name="Accelerometer"
          status={formatAvailability(availability.Accelerometer)}
          value={`x ${formatSensorValue(snapshot.acceleration?.x)} · y ${formatSensorValue(snapshot.acceleration?.y)} · z ${formatSensorValue(snapshot.acceleration?.z)}`}
        />
        <SensorRow
          name="Gyroscope"
          status={formatAvailability(availability.Gyroscope)}
          value={`x ${formatSensorValue(snapshot.gyroscope?.x)} · y ${formatSensorValue(snapshot.gyroscope?.y)} · z ${formatSensorValue(snapshot.gyroscope?.z)}`}
        />
        <SensorRow
          name="Device Motion"
          status={formatAvailability(availability["Device Motion"])}
          value={`x ${formatSensorValue(snapshot.deviceMotion?.x)} · y ${formatSensorValue(snapshot.deviceMotion?.y)} · z ${formatSensorValue(snapshot.deviceMotion?.z)}`}
        />
        <SensorRow
          name="Magnetometer"
          status={formatAvailability(availability.Magnetometer)}
          value={`x ${formatSensorValue(snapshot.magnetometer?.x)} · y ${formatSensorValue(snapshot.magnetometer?.y)} · z ${formatSensorValue(snapshot.magnetometer?.z)}`}
        />
      </View>
    </Card>
  );
}

type SensorRowProps = {
  name: string;
  status: string;
  value: string;
};

function SensorRow({ name, status, value }: SensorRowProps) {
  const isUnavailable = status === "Unavailable";

  return (
    <View style={styles.row}>
      <View>
        <AppText style={styles.name}>{name}</AppText>
        <AppText style={styles.value}>{value}</AppText>
      </View>
      <AppText style={[styles.status, isUnavailable && styles.unavailable]}>{status}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
  row: {
    borderBottomColor: "#1F2937",
    borderBottomWidth: 1,
    gap: 8,
    paddingBottom: 10,
  },
  name: {
    color: "#E5EDF8",
    fontWeight: "800",
  },
  value: {
    color: "#93A4B8",
    fontSize: 13,
  },
  status: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "800",
  },
  unavailable: {
    color: "#FCA5A5",
  },
});
