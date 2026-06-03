import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { Card } from "./Card";

type MetricGridProps = {
  duration: string;
  totalEvents: number;
  status: string;
};

export function MetricGrid({ duration, totalEvents, status }: MetricGridProps) {
  return (
    <View style={styles.grid}>
      <Card style={styles.metric}>
        <AppText style={styles.label}>Duration</AppText>
        <AppText style={styles.value}>{duration}</AppText>
      </Card>
      <Card style={styles.metric}>
        <AppText style={styles.label}>Events</AppText>
        <AppText style={styles.value}>{totalEvents}</AppText>
      </Card>
      <Card style={styles.metric}>
        <AppText style={styles.label}>Status</AppText>
        <AppText style={styles.statusValue}>{status}</AppText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  metric: {
    flex: 1,
    padding: 14,
  },
  label: {
    color: "#93A4B8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  value: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
  },
  statusValue: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 9,
  },
});
