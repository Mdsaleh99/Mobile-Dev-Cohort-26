import { StyleSheet, View } from "react-native";
import { EVENT_RULES } from "@/lib/driveRules";
import { EventBreakdown } from "@/types/drive";
import { AppText } from "./AppText";
import { Card } from "./Card";

type EventBreakdownCardProps = {
  breakdown: EventBreakdown;
};

export function EventBreakdownCard({ breakdown }: EventBreakdownCardProps) {
  return (
    <Card>
      <AppText style={styles.title}>Event Breakdown</AppText>
      <View style={styles.list}>
        {EVENT_RULES.map((rule) => (
          <View key={rule.type} style={styles.row}>
            <View style={styles.eventText}>
              <AppText style={styles.label}>{rule.label}</AppText>
              <AppText style={styles.points}>-{rule.points} points each</AppText>
            </View>
            <AppText style={styles.count}>{breakdown[rule.type]}</AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#1F2937",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  eventText: {
    flex: 1,
  },
  label: {
    color: "#E5EDF8",
    fontWeight: "700",
  },
  points: {
    color: "#93A4B8",
    fontSize: 13,
  },
  count: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
});
