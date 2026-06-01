// Sensor data processing utilities

export interface SensorReading {
  x: number;
  y: number;
  z: number;
}

export interface SensorStats {
  magnitude: number;
  angle: number;
  intensity: number;
}

// Calculate magnitude of acceleration vector
export const calculateMagnitude = (reading: SensorReading): number => {
  return Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2);
};

// Calculate angle in 2D (x, y)
export const calculateAngle = (reading: SensorReading): number => {
  return Math.atan2(reading.y, reading.x);
};

// Get intensity as percentage (0-100) based on magnitude
export const getIntensity = (
  reading: SensorReading,
  maxMagnitude: number = 3
): number => {
  const mag = calculateMagnitude(reading);
  return Math.min(100, (mag / maxMagnitude) * 100);
};

// Get stats from sensor reading
export const getSensorStats = (reading: SensorReading): SensorStats => ({
  magnitude: calculateMagnitude(reading),
  angle: calculateAngle(reading),
  intensity: getIntensity(reading),
});

// Simple moving average filter for smoothing
export class MovingAverageFilter {
  private buffer: number[] = [];
  private readonly windowSize: number;

  constructor(windowSize: number = 5) {
    this.windowSize = windowSize;
  }

  filter(value: number): number {
    this.buffer.push(value);
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();
    }
    return this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;
  }

  reset(): void {
    this.buffer = [];
  }
}

// Detect shake gesture
export const isShake = (
  previous: SensorReading,
  current: SensorReading,
  threshold: number = 2.5
): boolean => {
  const prevMag = calculateMagnitude(previous);
  const currMag = calculateMagnitude(current);
  const delta = Math.abs(currMag - prevMag);
  return delta > threshold;
};

// Detect tilt direction
export type TiltDirection = "left" | "right" | "forward" | "back" | "none";

export const detectTiltDirection = (
  reading: SensorReading,
  threshold: number = 0.3
): TiltDirection => {
  if (Math.abs(reading.x) > threshold) {
    return reading.x > 0 ? "right" : "left";
  }
  if (Math.abs(reading.y) > threshold) {
    return reading.y > 0 ? "back" : "forward";
  }
  return "none";
};
