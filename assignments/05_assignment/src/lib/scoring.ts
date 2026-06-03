import { DriveEvent, EventBreakdown, SafetyRating } from "@/types/drive";
import { EMPTY_EVENT_BREAKDOWN, INITIAL_DRIVE_SCORE } from "./driveRules";

export function calculateDriveScore(events: DriveEvent[]) {
  const deductions = events.reduce((total, event) => total + event.points, 0);

  return Math.max(0, INITIAL_DRIVE_SCORE - deductions);
}

export function getSafetyRating(score: number): SafetyRating {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 75) {
    return "Good";
  }

  if (score >= 60) {
    return "Moderate";
  }

  return "Risky";
}

export function getEventBreakdown(events: DriveEvent[]): EventBreakdown {
  return events.reduce(
    (breakdown, event) => ({
      ...breakdown,
      [event.type]: breakdown[event.type] + 1,
    }),
    { ...EMPTY_EVENT_BREAKDOWN },
  );
}
