import { useAccelerometerAdvanced } from "@/hooks/use-accelerometer-advanced";
import { useGameState } from "@/hooks/use-game-state";
import { clamp } from "@/utils/physics";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { GameStats } from "./game-stats";
import { GameControls } from "./game-controls";
import { AccelerometerDisplay } from "./accelerometer-display";

const BALL_SIZE = 40;
const OBSTACLE_SIZE = 60;
const MOVE_MULTIPLIERS = { easy: 80, normal: 120, hard: 160 };
const PLAY_BOX_WIDTH = 320;
const PLAY_BOX_HEIGHT = 400;

interface Obstacle {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export function TiltGame() {
  const insets = useSafeAreaInsets();
  const gameState = useGameState("normal");
  const { available, x, y, z, stats } = useAccelerometerAdvanced({
    smoothing: 0.3,
    updateInterval: 50,
    movingAverageWindow: 5,
  });

  const [ballX, setBallX] = useState(PLAY_BOX_WIDTH / 2);
  const [ballY, setBallY] = useState(PLAY_BOX_HEIGHT / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [showAdvancedSensors, setShowAdvancedSensors] = useState(false);

  const moveMultiplier = MOVE_MULTIPLIERS[gameState.difficulty];

  // Update ball position based on accelerometer
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const newX = clamp(
      PLAY_BOX_WIDTH / 2 + x * moveMultiplier,
      BALL_SIZE / 2,
      PLAY_BOX_WIDTH - BALL_SIZE / 2
    );
    const newY = clamp(
      PLAY_BOX_HEIGHT / 2 + y * moveMultiplier,
      BALL_SIZE / 2,
      PLAY_BOX_HEIGHT - BALL_SIZE / 2
    );

    setBallX(newX);
    setBallY(newY);

    // Check collisions with obstacles
    obstacles.forEach((obstacle) => {
      if (obstacle.collected) return;

      const dx = ballX - (obstacle.x + OBSTACLE_SIZE / 2);
      const dy = ballY - (obstacle.y + OBSTACLE_SIZE / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (BALL_SIZE + OBSTACLE_SIZE) / 2) {
        const points = gameState.difficulty === "hard" ? 100 : gameState.difficulty === "easy" ? 30 : 50;
        gameState.addScore(points);
        gameState.incrementBallsCaught();

        setObstacles((prev) =>
          prev.map((obs) =>
            obs.id === obstacle.id ? { ...obs, collected: true } : obs
          )
        );

        // Spawn new obstacle after delay
        setTimeout(() => spawnObstacle(), 500);
      }
    });
  }, [ballX, ballY, x, y, moveMultiplier, gameState, obstacles]);

  // Spawn obstacles
  const spawnObstacle = () => {
    const padding = 20;
    const randomX = Math.random() * (PLAY_BOX_WIDTH - OBSTACLE_SIZE - padding * 2) + padding;
    const randomY = Math.random() * (PLAY_BOX_HEIGHT - OBSTACLE_SIZE - padding * 2) + padding;

    setObstacles((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        x: randomX,
        y: randomY,
        collected: false,
      },
    ]);
  };

  // Initialize game with obstacles
  useEffect(() => {
    if (!gameState.isGameOver && obstacles.length === 0) {
      spawnObstacle();
    }
  }, [gameState.isGameOver]);

  // Clean up collected obstacles
  useEffect(() => {
    setObstacles((prev) =>
      prev.filter((obs) => !obs.collected || Math.random() > 0.7)
    );
  }, []);

  const handleReset = () => {
    gameState.resetGame();
    setBallX(PLAY_BOX_WIDTH / 2);
    setBallY(PLAY_BOX_HEIGHT / 2);
    setObstacles([]);
    setTimeout(() => spawnObstacle(), 100);
  };

  if (!available) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>⚠️ Accelerometer Not Available</Text>
        <Text style={styles.subtitle}>
          This game requires an accelerometer. Please use a physical device, not a simulator.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { paddingTop: insets.top + 12 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🎮 Tilt Game</Text>
          <Text style={styles.subtitle}>Catch the targets by tilting your phone!</Text>
        </View>
        <Pressable
          style={styles.sensorToggle}
          onPress={() => setShowAdvancedSensors(!showAdvancedSensors)}
        >
          <Text style={styles.sensorToggleText}>📊</Text>
        </Pressable>
      </View>

      <GameStats
        score={gameState.score}
        level={gameState.level}
        timeElapsed={gameState.timeElapsed}
        ballsCaught={gameState.ballsCaught}
      />

      <View
        style={[
          styles.playBox,
          gameState.isPaused && styles.pausedOverlay,
        ]}
      >
        {/* Ball */}
        <View
          style={[
            styles.ball,
            {
              transform: [
                { translateX: ballX - PLAY_BOX_WIDTH / 2 - BALL_SIZE / 2 },
                { translateY: ballY - PLAY_BOX_HEIGHT / 2 - BALL_SIZE / 2 },
              ],
            },
          ]}
        />

        {/* Obstacles */}
        {obstacles
          .filter((obs) => !obs.collected)
          .map((obstacle) => (
            <View
              key={obstacle.id}
              style={[
                styles.obstacle,
                {
                  left: obstacle.x - PLAY_BOX_WIDTH / 2,
                  top: obstacle.y - PLAY_BOX_HEIGHT / 2,
                },
              ]}
            />
          ))}

        {gameState.isPaused && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseText}>PAUSED</Text>
          </View>
        )}

        {gameState.isGameOver && (
          <View style={styles.gameOverOverlay}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.gameOverScore}>Score: {gameState.score}</Text>
          </View>
        )}
      </View>

      {showAdvancedSensors && (
        <AccelerometerDisplay
          x={x}
          y={y}
          z={z}
          magnitude={stats.magnitude}
          intensity={stats.intensity}
          showAdvanced
        />
      )}

      <GameControls
        isPaused={gameState.isPaused}
        onPauseToggle={() => gameState.setPaused(!gameState.isPaused)}
        onReset={handleReset}
        difficulty={gameState.difficulty}
        onDifficultyChange={gameState.setDifficulty}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Tips:</Text>
        <Text style={styles.footerHint}>• Tilt gently for precision</Text>
        <Text style={styles.footerHint}>• Collect more targets for higher scores</Text>
        <Text style={styles.footerHint}>• Each difficulty level changes speed and scoring</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1220",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  sensorToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  sensorToggleText: {
    fontSize: 16,
  },
  playBox: {
    height: PLAY_BOX_HEIGHT,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#111827",
    overflow: "hidden",
    position: "relative",
  },
  pausedOverlay: {
    opacity: 0.8,
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "#22d3ee",
    position: "absolute",
    left: PLAY_BOX_WIDTH / 2 - BALL_SIZE / 2,
    top: PLAY_BOX_HEIGHT / 2 - BALL_SIZE / 2,
    shadowColor: "#00d9ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  obstacle: {
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    borderRadius: 12,
    backgroundColor: "#fbbf24",
    position: "absolute",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  pauseText: {
    color: "#f1f5f9",
    fontSize: 32,
    fontWeight: "700",
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  gameOverText: {
    color: "#ef4444",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 12,
  },
  gameOverScore: {
    color: "#f1f5f9",
    fontSize: 24,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  footerText: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  footerHint: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});
