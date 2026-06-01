// Game constants and configuration

export const GAME_CONFIG = {
  // Difficulty settings
  difficulties: {
    easy: {
      speed: 80,
      scoreMultiplier: 1,
      spawnRate: 2000,
      targetPoints: 30,
    },
    normal: {
      speed: 120,
      scoreMultiplier: 1.5,
      spawnRate: 1500,
      targetPoints: 50,
    },
    hard: {
      speed: 160,
      scoreMultiplier: 2,
      spawnRate: 1000,
      targetPoints: 100,
    },
  },

  // Game field dimensions
  playBox: {
    width: 320,
    height: 400,
  },

  // Object sizes
  ball: {
    size: 40,
  },
  obstacle: {
    size: 60,
  },

  // Physics
  physics: {
    smoothingAlpha: 0.3,
    updateInterval: 50,
    movingAverageWindow: 5,
  },

  // Level progression
  levelThreshold: 500, // Points needed per level
};

// Utility to get difficulty settings
export const getDifficultyConfig = (
  difficulty: "easy" | "normal" | "hard"
) => GAME_CONFIG.difficulties[difficulty];

// Utility to calculate points based on difficulty
export const calculatePoints = (
  basePoints: number,
  difficulty: "easy" | "normal" | "hard"
): number => {
  const config = getDifficultyConfig(difficulty);
  return Math.floor(basePoints * config.scoreMultiplier);
};

// Format score for display
export const formatScore = (score: number): string => {
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + "M";
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + "K";
  }
  return score.toString();
};

// Format time for display
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// Get difficulty color
export const getDifficultyColor = (difficulty: "easy" | "normal" | "hard"): string => {
  switch (difficulty) {
    case "easy":
      return "#10b981"; // Green
    case "normal":
      return "#f59e0b"; // Amber
    case "hard":
      return "#ef4444"; // Red
  }
};
