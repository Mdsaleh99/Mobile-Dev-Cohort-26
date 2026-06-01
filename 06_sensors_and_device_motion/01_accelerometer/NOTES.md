# Accelerometer — Learning Notes (Expo SDK 55, Android, Expo Go)

Docs: [Accelerometer](https://docs.expo.dev/versions/v55.0.0/sdk/accelerometer/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is the accelerometer?

The **accelerometer** measures **acceleration** on three axes: **x**, **y**, **z**.

In Expo, values are in **g-force (g)**:

- **1 g ≈ 9.81 m/s²** (Earth’s gravity)
- Phone **flat on a table** → often **z ≈ 1**, **x ≈ 0**, **y ≈ 0**

It senses gravity + movement. Tilting the phone moves gravity across x/y — that’s how our tilt ball works.

---

## Why does it exist?

- Screen rotation (portrait / landscape)
- Tilt games and shake actions
- Step / activity detection
- Fall detection, camera leveling, maps

---

## Real-world examples

1. **Tilt games** — roll a ball (this project)
2. **Shake to refresh / undo**
3. **Auto-rotate** screen
4. **Fitness / pedometer** (with other sensors)
5. **“Flip phone face-down”** → silent mode

---

## How to use with Expo (Android + Expo Go 55)

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { Accelerometer } from "expo-sensors";
```

### Basic flow

```ts
const ok = await Accelerometer.isAvailableAsync();
if (!ok) return;

Accelerometer.setUpdateInterval(100); // new numbers every 100ms

const sub = Accelerometer.addListener(({ x, y, z }) => {
  console.log(x, y, z);
});

sub.remove(); // when done
```

### What does `setUpdateInterval(100)` mean?

**100** = milliseconds between updates → about **10 new readings per second**.

Each reading is fresh **x, y, z** numbers passed to your listener.

### Android notes

- Works in **Expo Go 55** on a **real device** (not emulator)
- **Android 12+** caps sensors at ~200 Hz; `100` ms is fine
- Usually **no permission dialog** for accelerometer on Android in Expo Go

---

## Mostly used APIs

| API | Purpose |
|-----|---------|
| `Accelerometer.isAvailableAsync()` | Check before subscribing |
| `Accelerometer.setUpdateInterval(ms)` | How often you get x,y,z |
| `Accelerometer.addListener(callback)` | Stream readings |
| `subscription.remove()` | Stop listening |
| `getPermissionsAsync()` / `requestPermissionsAsync()` | Permissions (mainly web) |

---

## Types

### `AccelerometerMeasurement`

| Field | Type | Meaning |
|-------|------|---------|
| `x` | `number` | g on X axis |
| `y` | `number` | g on Y axis |
| `z` | `number` | g on Z axis |
| `timestamp` | `number` | Time in **seconds** |

### `PermissionStatus`

`GRANTED` · `DENIED` · `UNDETERMINED`

---

## This project’s core idea

```ts
transform: [
  { translateX: x * MOVE },
  { translateY: y * MOVE },
]
```

`MOVE = 100` scales tilt into pixels. Tilt changes x/y → ball moves.

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-accelerometer.ts` | Subscribe, expose x, y, z |
| `src/components/tilt-game.tsx` | Show values + move ball |
| `src/app/index.tsx` | Home screen |

---

## What to try on Android

1. Flat on table → z ≈ 1, x and y near 0  
2. Tilt left/right → **x** changes, ball moves sideways  
3. Tilt forward/back → **y** changes, ball moves up/down  
