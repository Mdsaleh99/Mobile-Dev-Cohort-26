import { Text, View, StyleSheet } from "react-native";

interface GameStatsProps {
  score: number;
  level: number;
  timeElapsed: number;
  ballsCaught: number;
}

export function GameStats({ score, level, timeElapsed, ballsCaught }: GameStatsProps) {
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Score</Text>
        <Text style={styles.statValue}>{score}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Level</Text>
        <Text style={styles.statValue}>{level}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Time</Text>
        <Text style={styles.statValue}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Caught</Text>
        <Text style={styles.statValue}>{ballsCaught}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statValue: {
    color: "#22d3ee",
    fontSize: 16,
    fontWeight: "700",
  },
});
