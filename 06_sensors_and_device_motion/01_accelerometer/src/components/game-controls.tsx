import { Text, View, StyleSheet, Pressable } from "react-native";

interface ControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
  difficulty: "easy" | "normal" | "hard";
  onDifficultyChange: (difficulty: "easy" | "normal" | "hard") => void;
}

export function GameControls({
  isPaused,
  onPauseToggle,
  onReset,
  difficulty,
  onDifficultyChange,
}: ControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, isPaused && styles.buttonActive]}
          onPress={onPauseToggle}
        >
          <Text style={styles.buttonText}>{isPaused ? "Resume" : "Pause"}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.difficultyRow}>
        <Text style={styles.difficultyLabel}>Difficulty:</Text>
        {(["easy", "normal", "hard"] as const).map((level) => (
          <Pressable
            key={level}
            style={[
              styles.difficultyButton,
              difficulty === level && styles.difficultyButtonActive,
            ]}
            onPress={() => onDifficultyChange(level)}
          >
            <Text
              style={[
                styles.difficultyText,
                difficulty === level && styles.difficultyTextActive,
              ]}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0f172a",
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  buttonActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  buttonText: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  difficultyLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  difficultyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  difficultyButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  difficultyText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyTextActive: {
    color: "#f1f5f9",
  },
});
