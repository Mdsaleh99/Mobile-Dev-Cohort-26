import { StyleSheet, View } from "react-native";
import { SafetyRating } from "@/types/drive";
import { AppText } from "./AppText";
import { Card } from "./Card";

type ScoreCardProps = {
  score: number;
  rating: SafetyRating;
  isDriving: boolean;
};

function getRatingColor(rating: SafetyRating) {
  if (rating === "Excellent") {
    return "#22C55E";
  }

  if (rating === "Good") {
    return "#84CC16";
  }

  if (rating === "Moderate") {
    return "#F59E0B";
  }

  return "#EF4444";
}

export function ScoreCard({ score, rating, isDriving }: ScoreCardProps) {
  return (
    <Card style={styles.card}>
      <View>
        <AppText style={styles.label}>{isDriving ? "Live Driving Score" : "Driving Score"}</AppText>
        <AppText style={styles.score}>{score}</AppText>
      </View>
      <View style={[styles.ratingPill, { backgroundColor: getRatingColor(rating) }]}>
        <AppText style={styles.rating}>{rating}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#93A4B8",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  score: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "800",
    lineHeight: 66,
  },
  ratingPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rating: {
    color: "#06121F",
    fontWeight: "800",
  },
});
