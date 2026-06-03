import { DriveEventType } from "@/types/drive";

export const SENSOR_UPDATE_INTERVAL_MS = 200;
export const EVENT_COOLDOWN_MS = 1200;
export const INITIAL_DRIVE_SCORE = 100;

export type EventRule = {
  type: DriveEventType;
  label: string;
  points: number;
  threshold: string;
  description: string;
};

export const EVENT_RULES: EventRule[] = [
  {
    type: "harsh-braking",
    label: "Harsh Braking",
    points: 5,
    threshold: "Accelerometer Y < -1.35g",
    description: "Phone moves sharply backward, mimicking sudden braking.",
  },
  {
    type: "harsh-acceleration",
    label: "Harsh Acceleration",
    points: 5,
    threshold: "Accelerometer Y > 1.35g",
    description: "Phone moves sharply forward, mimicking quick acceleration.",
  },
  {
    type: "sharp-turn",
    label: "Sharp Turn",
    points: 3,
    threshold: "Rotation Z > 2.2 rad/s",
    description: "Phone rotates strongly around the vertical axis.",
  },
  {
    type: "aggressive-steering",
    label: "Aggressive Steering",
    points: 4,
    threshold: "Gyroscope magnitude > 3.2 rad/s",
    description: "Large combined rotation across multiple axes.",
  },
  {
    type: "excessive-device-movement",
    label: "Excessive Device Movement",
    points: 4,
    threshold: "Acceleration magnitude > 2.4g",
    description: "Strong unstable phone movement while the drive is active.",
  },
  {
    type: "phone-handling",
    label: "Possible Phone Handling",
    points: 10,
    threshold: "Acceleration > 1.8g and rotation > 2.5 rad/s",
    description: "Random movement plus rotation, suggesting the phone is being handled.",
  },
];

export const EVENT_RULE_BY_TYPE = EVENT_RULES.reduce(
  (rules, rule) => ({ ...rules, [rule.type]: rule }),
  {} as Record<DriveEventType, EventRule>,
);

export const EMPTY_EVENT_BREAKDOWN = EVENT_RULES.reduce(
  (breakdown, rule) => ({ ...breakdown, [rule.type]: 0 }),
  {} as Record<DriveEventType, number>,
);
