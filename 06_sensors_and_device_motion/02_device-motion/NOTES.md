# DeviceMotion — Learning Notes (Expo SDK 55, Android & iOS, Expo Go)

Docs: [DeviceMotion](https://docs.expo.dev/versions/v55.0.0/sdk/devicemotion/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is DeviceMotion?

**DeviceMotion** combines several motion sensors into **one** update:

| Field | Meaning |
|-------|---------|
| `acceleration` | Movement **without** gravity (m/s²) — best for **shake** |
| `accelerationIncludingGravity` | Includes gravity (m/s²) |
| `rotation` | Device angle in space |
| `rotationRate` | How fast it is rotating (deg/s) |
| `orientation` | Screen rotation (0, 90, 180, -90) |

For **shake detection**, we use **`acceleration`** (not the raw Accelerometer in g).

---

## Why does it exist?

One API instead of wiring accelerometer + gyro + orientation yourself:

- Shake / undo gestures
- Games (tilt + turn)
- AR (which way the phone points)
- Fitness / motion apps

---

## vs Accelerometer only

| | Accelerometer | DeviceMotion |
|---|---------------|----------------|
| Data | x, y, z in **g** | Many fields, acceleration in **m/s²** |
| Gravity | Included in reading | Separated: `acceleration` vs `accelerationIncludingGravity` |
| Shake | Harder (gravity mixed in) | Easier with `acceleration` |

---

## Real-world examples

1. **Shake to undo** (mail, notes)
2. **Shake to refresh**
3. **Games** — steering + orientation
4. **Screen rotation** hints

---

## How to use with Expo

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { DeviceMotion } from "expo-sensors";
```

### Basic flow

```ts
const ok = await DeviceMotion.isAvailableAsync();
await DeviceMotion.requestPermissionsAsync(); // iOS motion access

DeviceMotion.setUpdateInterval(100);

const sub = DeviceMotion.addListener((data) => {
  const { x, y, z } = data.acceleration ?? { x: 0, y: 0, z: 0 };
  const force = Math.hypot(x, y, z);
});

sub.remove();
```

### iOS: motion permission

Add to `app.json`:

```json
[
  "expo-sensors",
  {
    "motionPermission": "Allow this app to access your device motion."
  }
]
```

### Android

Usually works in Expo Go for learning. Android 12+ caps sensor rate at ~200 Hz.

---

## Shake detection (this project)

```ts
const force = Math.hypot(x, y, z);

if (force > SHAKE_THRESHOLD) {
  // shaking
}
```

| Constant | Value | Meaning |
|----------|-------|---------|
| `SHAKE_THRESHOLD` | 14 | m/s² — tune if too sensitive |
| `COOLDOWN_MS` | 800 | Min time between sheet opens |

---

## Mostly used APIs

| API | Purpose |
|-----|---------|
| `DeviceMotion.isAvailableAsync()` | Check sensor |
| `DeviceMotion.setUpdateInterval(ms)` | Update rate |
| `DeviceMotion.addListener(callback)` | Stream motion data |
| `subscription.remove()` | Stop |
| `requestPermissionsAsync()` | Motion permission |
| `DeviceMotion.Gravity` | `9.80665` m/s² |

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-shake-detection.ts` | Listen + emit shake snapshots |
| `src/components/shake-detector.tsx` | Main screen + haptics |
| `src/components/shake-bottom-sheet.tsx` | Animated sheet on shake |
| `src/app/index.tsx` | Home screen |

---

## What to try

1. Open on a **real device**
2. Watch **force** — low when still, high when shaking
3. Shake firmly — hero turns purple, **bottom sheet** slides up with peak force
4. Swipe down, tap backdrop, or **Got it** to dismiss; shake again after cooldown

If too hard to trigger, lower `SHAKE_THRESHOLD` to `10` in the hook.
