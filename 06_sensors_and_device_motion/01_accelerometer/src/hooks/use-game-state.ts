import { useEffect, useState } from "react";

export interface GameState {
  score: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  timeElapsed: number;
  ballsCaught: number;
  difficulty: "easy" | "normal" | "hard";
}

const INITIAL_STATE: GameState = {
  score: 0,
  level: 1,
  isGameOver: false,
  isPaused: false,
  timeElapsed: 0,
  ballsCaught: 0,
  difficulty: "normal",
};

export function useGameState(initialDifficulty: "easy" | "normal" | "hard" = "normal") {
  const [gameState, setGameState] = useState<GameState>({
    ...INITIAL_STATE,
    difficulty: initialDifficulty,
  });

  // Timer effect
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver, gameState.isPaused]);

  const addScore = (points: number) => {
    setGameState((prev) => {
      const newScore = prev.score + points;
      const newLevel = Math.floor(newScore / 500) + 1;
      return {
        ...prev,
        score: newScore,
        level: newLevel,
      };
    });
  };

  const incrementBallsCaught = () => {
    setGameState((prev) => ({
      ...prev,
      ballsCaught: prev.ballsCaught + 1,
    }));
  };

  const setGameOver = (isOver: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isGameOver: isOver,
    }));
  };

  const setPaused = (isPaused: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isPaused,
    }));
  };

  const resetGame = () => {
    setGameState({
      ...INITIAL_STATE,
      difficulty: gameState.difficulty,
    });
  };

  const setDifficulty = (difficulty: "easy" | "normal" | "hard") => {
    setGameState((prev) => ({
      ...prev,
      difficulty,
      isGameOver: false,
      score: 0,
      level: 1,
      timeElapsed: 0,
      ballsCaught: 0,
    }));
  };

  return {
    ...gameState,
    addScore,
    incrementBallsCaught,
    setGameOver,
    setPaused,
    resetGame,
    setDifficulty,
  };
}
