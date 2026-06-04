# Driving Safety Score

## Project Overview

This is an Expo-based mobile app that simulates a driving safety score using live device sensor data.

The user starts a drive session, moves the phone to mimic driving behavior, and the app detects unsafe motion patterns such as harsh braking, harsh acceleration, sharp turns, aggressive steering, excessive device movement, and possible phone handling.

Each detected event adds a penalty to the session score. The UI then shows the live score, safety rating, event breakdown, event timeline, sensor availability, and the thresholds used for detection.

## Tech Stack Used

- Expo SDK 55
- React 19
- React Native 0.83
- TypeScript
- Expo Router
- `expo-sensors`
- `expo-status-bar`
- `react-native-safe-area-context`
- `react-native-reanimated`

## Sensors Used

The app reads these Expo sensors:

- Accelerometer
- Gyroscope
- Device Motion
- Magnetometer

How they are used in the app:

- Accelerometer: used for harsh braking, harsh acceleration, and excessive movement detection.
- Gyroscope: used for sharp turn and aggressive steering detection.
- Device Motion: used for rotation-rate-based detection and as an additional movement signal.
- Magnetometer: captured and displayed in the sensor status card, but not used in event detection.

## Event Detection Strategy

Event detection happens only while a drive session is active.

The hook in `src/hooks/useDriveSession.ts` subscribes to sensor updates and calls `detectDriveEvents()` whenever fresh readings arrive. The detector checks the latest sensor snapshot against a fixed rule set and creates one or more events when thresholds are crossed.

Important details:

- Sensor updates are sampled every 200 ms.
- Each event type has a cooldown of 1200 ms to prevent repeated scoring from the same motion.
- Multiple event types can be detected from the same sensor snapshot.
- Events are inserted into the timeline with the newest event first.

## Threshold Values Chosen

The thresholds are defined in `src/lib/driveRules.ts` and mirrored in the UI.

- Harsh Braking: `Accelerometer Y < -1.35g`
- Harsh Acceleration: `Accelerometer Y > 1.35g`
- Sharp Turn: `max(|gyroscope.z|, |device motion rotation.z|) > 2.2 rad/s`
- Aggressive Steering: `Gyroscope magnitude > 3.2 rad/s`
- Excessive Device Movement: `Acceleration magnitude > 2.4g`
- Possible Phone Handling: `Acceleration magnitude > 1.8g and max(gyroscope magnitude, device motion rotation magnitude) > 2.5 rad/s`

## Driving Score Calculation Logic

The session starts at `100`.

Each event subtracts a fixed number of points:

- Harsh Braking: 5
- Harsh Acceleration: 5
- Sharp Turn: 3
- Aggressive Steering: 4
- Excessive Device Movement: 4
- Possible Phone Handling: 10

Score calculation:

- Start with 100 points.
- Subtract the total points from all detected events.
- Clamp the final score at a minimum of 0.

Safety ratings are derived from the score:

- `90-100`: Excellent
- `75-89`: Good
- `60-74`: Moderate
- `0-59`: Risky

## How to Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo dev server:

   ```bash
   npm run start
   ```

3. Optional platform shortcuts:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Assumptions Made

- The app is intended as a sensor-based simulation, not a real vehicle telematics system.
- The phone is expected to be physically moved by hand to simulate driving behavior.
- Sensor availability can vary by device, so the UI checks availability before subscribing.
- The accelerometer and gyroscope are the primary signals for event detection.
- Device Motion rotation rate is converted from degrees per second to radians per second before detection.
- Magnetometer data is informational only in the current implementation.
- The scoring rules are intentionally simple and deterministic so the assignment output is easy to verify.
