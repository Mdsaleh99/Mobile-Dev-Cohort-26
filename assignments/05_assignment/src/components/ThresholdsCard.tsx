import { StyleSheet, View } from "react-native";
import { EventRule } from "@/lib/driveRules";
import { AppText } from "./AppText";
import { Card } from "./Card";

type ThresholdsCardProps = {
  rules: EventRule[];
};

export function ThresholdsCard({ rules }: ThresholdsCardProps) {
  return (
    <Card>
      <AppText style={styles.title}>Detection Thresholds</AppText>
      <View style={styles.list}>
        {rules.map((rule) => (
          <View key={rule.type} style={styles.rule}>
            <AppText style={styles.label}>{rule.label}</AppText>
            <AppText style={styles.threshold}>{rule.threshold}</AppText>
            <AppText style={styles.description}>{rule.description}</AppText>
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
  rule: {
    backgroundColor: "#0B1220",
    borderRadius: 14,
    padding: 12,
  },
  label: {
    color: "#E5EDF8",
    fontWeight: "800",
  },
  threshold: {
    color: "#38BDF8",
    fontSize: 13,
    fontWeight: "700",
  },
  description: {
    color: "#93A4B8",
    fontSize: 13,
  },
});
