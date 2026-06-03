export type DriveEventType =
  | "harsh-braking"
  | "harsh-acceleration"
  | "sharp-turn"
  | "aggressive-steering"
  | "excessive-device-movement"
  | "phone-handling";

export type SafetyRating = "Excellent" | "Good" | "Moderate" | "Risky";

export type SensorName =
  | "Accelerometer"
  | "Gyroscope"
  | "Device Motion"
  | "Magnetometer";

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type DriveEvent = {
  id: string;
  type: DriveEventType;
  label: string;
  points: number;
  timestamp: number;
  detail: string;
};

export type EventBreakdown = Record<DriveEventType, number>;

export type SensorAvailability = Record<SensorName, boolean | null>;

export type SensorSnapshot = {
  acceleration: Vector3 | null;
  gyroscope: Vector3 | null;
  deviceMotion: Vector3 | null;
  magnetometer: Vector3 | null;
};
