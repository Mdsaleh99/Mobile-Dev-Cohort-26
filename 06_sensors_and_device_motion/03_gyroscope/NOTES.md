# Gyroscope — Learning Notes (Expo SDK 55, Android, Expo Go)

Docs: [Gyroscope](https://docs.expo.dev/versions/v55.0.0/sdk/gyroscope/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is the gyroscope?

The **gyroscope** measures **how fast** the phone is **rotating** (spinning), on three axes.

| Axis | Meaning (roughly, phone in portrait) |
|------|--------------------------------------|
| **x** | Spin around the horizontal axis (tilt forward/back) |
| **y** | Spin around the vertical axis (tilt left/right) |
| **z** | Spin like a top (twist while flat on a table) |

**Units in Expo:** **rad/s** (radians per second), not degrees, not g.

- Phone **still** → x, y, z are usually **near 0**
- Phone **rotating** → one or more values go up or down

---

## Why does it exist?

The gyro tracks **rotation speed**. Apps combine it with other sensors for:

- Smooth screen rotation and AR
- Games (steering by twisting)
- Camera stabilization
- VR / 360° experiences
- Drones and robotics (orientation control)

---

## Accelerometer vs gyroscope (important!)

| | Accelerometer | Gyroscope |
|---|---------------|-----------|
| Measures | Acceleration / tilt (includes gravity) | **Rotation speed** |
| Still phone | x,y small, z ≈ 1 | x,y,z ≈ 0 |
| Use case | “Which way is down?” / tilt ball | “How fast am I spinning?” |

**Accelerometer** → tilt the ball (position).  
**Gyroscope** → 3D card wobbles **while you rotate**; when you stop, it flattens again.

---

## Real-world examples

1. **3D card / parallax UI** — UI reacts when you rotate the device
2. **Racing games** — twist phone to steer
3. **VR headsets** — track head turn speed
4. **Image stabilization** — detect hand shake rotation
5. **Drones** — how fast the craft is rolling/pitching

---

## How to use with Expo (Android + Expo Go 55)

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { Gyroscope } from "expo-sensors";
```

### Basic flow (same pattern as accelerometer)

```ts
const ok = await Gyroscope.isAvailableAsync();
if (!ok) return;

Gyroscope.setUpdateInterval(100); // new values every 100ms

const sub = Gyroscope.addListener(({ x, y, z }) => {
  console.log(x, y, z);
});

// cleanup
sub.remove();
```

### Android notes

- Works in **Expo Go 55** on a **real device**
- **Android 12+** caps sensor rate at ~200 Hz (`setUpdateInterval(16)` is fine)
- No special permission dialog for gyro on most Android devices in Expo Go
- Emulator: little or no real gyro data

---

## Mostly used APIs

| API | Purpose |
|-----|---------|
| `Gyroscope.isAvailableAsync()` | Check before subscribing |
| `Gyroscope.setUpdateInterval(ms)` | How often you get new x,y,z |
| `Gyroscope.addListener(callback)` | Stream readings |
| `subscription.remove()` | Stop listening |
| `Gyroscope.getPermissionsAsync()` | Permission state |
| `Gyroscope.requestPermissionsAsync()` | Ask permission (mainly web) |

---

## Types & constants

### `GyroscopeMeasurement`

| Field | Type | Meaning |
|-------|------|---------|
| `x` | `number` | Rotation speed on X (rad/s) |
| `y` | `number` | Rotation speed on Y (rad/s) |
| `z` | `number` | Rotation speed on Z (rad/s) |
| `timestamp` | `number` | Time in **seconds** |

### `PermissionStatus`

`GRANTED` · `DENIED` · `UNDETERMINED`

You define app constants, e.g. `TILT = 12` to scale rad/s into degrees for the 3D card.

---

## 3D card in this project

```ts
transform: [
  { perspective: 1000 },
  { rotateX: `${y * TILT}deg` },
  { rotateY: `${-x * TILT}deg` },
]
```

- **perspective** — makes the card look 3D
- **rotateX / rotateY** — tied to gyro **y** and **x**
- When rotation stops, values → 0 → card returns to flat

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-gyroscope.ts` | Subscribe, expose x, y, z |
| `src/components/gyroscope-card.tsx` | Show values + 3D transform |
| `src/app/index.tsx` | Home screen |

---

## What to try on your Android phone

1. Open app in Expo Go → keep phone still → values ≈ 0  
2. Rotate forward/back slowly → **x** or **y** change, card tilts  
3. Twist flat on table → **z** changes  
4. Stop moving → card goes flat again  
