import { DriveEvent, DriveEventType, Vector3 } from "@/types/drive";
import { EVENT_COOLDOWN_MS, EVENT_RULE_BY_TYPE } from "./driveRules";

type DetectionInput = {
  acceleration: Vector3 | null;
  gyroscope: Vector3 | null;
  deviceRotationRate: Vector3 | null;
  lastEventTimes: Partial<Record<DriveEventType, number>>;
  now: number;
};

type CandidateEvent = {
  type: DriveEventType;
  detail: string;
};

function magnitude(vector: Vector3 | null) {
  if (!vector) {
    return 0;
  }

  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

function canCreateEvent(
  type: DriveEventType,
  now: number,
  lastEventTimes: Partial<Record<DriveEventType, number>>,
) {
  const lastTime = lastEventTimes[type] ?? 0;

  return now - lastTime >= EVENT_COOLDOWN_MS;
}

function buildDriveEvent(candidate: CandidateEvent, now: number): DriveEvent {
  const rule = EVENT_RULE_BY_TYPE[candidate.type];

  return {
    id: `${candidate.type}-${now}`,
    type: candidate.type,
    label: rule.label,
    points: rule.points,
    timestamp: now,
    detail: candidate.detail,
  };
}

export function detectDriveEvents(input: DetectionInput) {
  const accelerationMagnitude = magnitude(input.acceleration);
  const gyroscopeMagnitude = magnitude(input.gyroscope);
  const deviceRotationMagnitude = magnitude(input.deviceRotationRate);
  const rotationZ = Math.max(
    Math.abs(input.gyroscope?.z ?? 0),
    Math.abs(input.deviceRotationRate?.z ?? 0),
  );

  const candidates: CandidateEvent[] = [];

  if ((input.acceleration?.y ?? 0) < -1.35) {
    candidates.push({
      type: "harsh-braking",
      detail: `Y acceleration ${input.acceleration?.y.toFixed(2)}g`,
    });
  }

  if ((input.acceleration?.y ?? 0) > 1.35) {
    candidates.push({
      type: "harsh-acceleration",
      detail: `Y acceleration ${input.acceleration?.y.toFixed(2)}g`,
    });
  }

  if (rotationZ > 2.2) {
    candidates.push({
      type: "sharp-turn",
      detail: `Z rotation ${rotationZ.toFixed(2)} rad/s`,
    });
  }

  if (gyroscopeMagnitude > 3.2) {
    candidates.push({
      type: "aggressive-steering",
      detail: `Gyroscope magnitude ${gyroscopeMagnitude.toFixed(2)} rad/s`,
    });
  }

  if (accelerationMagnitude > 2.4) {
    candidates.push({
      type: "excessive-device-movement",
      detail: `Acceleration magnitude ${accelerationMagnitude.toFixed(2)}g`,
    });
  }

  if (accelerationMagnitude > 1.8 && Math.max(gyroscopeMagnitude, deviceRotationMagnitude) > 2.5) {
    candidates.push({
      type: "phone-handling",
      detail: "Strong acceleration and rotation detected together",
    });
  }

  return candidates
    .filter((candidate) =>
      canCreateEvent(candidate.type, input.now, input.lastEventTimes),
    )
    .map((candidate) => buildDriveEvent(candidate, input.now));
}

export function convertDegreesToRadiansPerSecond(rotationRate: Vector3 | null) {
  if (!rotationRate) {
    return null;
  }

  const radiansPerDegree = Math.PI / 180;

  return {
    x: rotationRate.x * radiansPerDegree,
    y: rotationRate.y * radiansPerDegree,
    z: rotationRate.z * radiansPerDegree,
  };
}
