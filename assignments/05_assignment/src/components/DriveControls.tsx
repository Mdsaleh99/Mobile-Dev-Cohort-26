import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./AppText";

type DriveControlsProps = {
  isDriving: boolean;
  onStart: () => void;
  onEnd: () => void;
};

export function DriveControls({ isDriving, onStart, onEnd }: DriveControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        disabled={isDriving}
        onPress={onStart}
        style={({ pressed }) => [
          styles.button,
          styles.startButton,
          isDriving && styles.disabledButton,
          pressed && styles.pressedButton,
        ]}
      >
        <AppText style={styles.buttonText}>Start Drive</AppText>
      </Pressable>
      <Pressable
        disabled={!isDriving}
        onPress={onEnd}
        style={({ pressed }) => [
          styles.button,
          styles.endButton,
          !isDriving && styles.disabledButton,
          pressed && styles.pressedButton,
        ]}
      >
        <AppText style={styles.buttonText}>End Drive</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    paddingVertical: 15,
  },
  startButton: {
    backgroundColor: "#22C55E",
  },
  endButton: {
    backgroundColor: "#EF4444",
  },
  disabledButton: {
    backgroundColor: "#374151",
  },
  pressedButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
