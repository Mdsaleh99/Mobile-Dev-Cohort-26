// Physics utilities for the tilt game

export interface Vector2 {
  x: number;
  y: number;
}

export interface PhysicsBody {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
}

// Apply damping to reduce oscillation
export const applyDamping = (value: number, damping: number = 0.85): number => {
  return value * damping;
};

// Smooth accelerometer data with exponential moving average
export const smoothValue = (
  current: number,
  previous: number,
  alpha: number = 0.3
): number => {
  return alpha * current + (1 - alpha) * previous;
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Calculate distance between two points
export const distance = (p1: Vector2, p2: Vector2): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Check circle to circle collision
export const checkCircleCollision = (
  pos1: Vector2,
  radius1: number,
  pos2: Vector2,
  radius2: number
): boolean => {
  return distance(pos1, pos2) < radius1 + radius2;
};

// Check circle to rect collision
export const checkCircleRectCollision = (
  circlePos: Vector2,
  circleRadius: number,
  rectPos: Vector2,
  rectWidth: number,
  rectHeight: number
): boolean => {
  const closestX = clamp(circlePos.x, rectPos.x, rectPos.x + rectWidth);
  const closestY = clamp(circlePos.y, rectPos.y, rectPos.y + rectHeight);

  return distance(circlePos, { x: closestX, y: closestY }) < circleRadius;
};

// Linear interpolation
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

// Map value from one range to another
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};
