# Magnetometer — Learning Notes (Expo SDK 55, Android, Expo Go)

Docs: [Magnetometer](https://docs.expo.dev/versions/v55.0.0/sdk/magnetometer/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is the magnetometer?

The **magnetometer** measures the **magnetic field** around the phone on three axes.

| Axis | Meaning |
|------|---------|
| **x** | Field strength along the phone’s X axis |
| **y** | Field strength along the phone’s Y axis |
| **z** | Field strength along the phone’s Z axis |

**Units in Expo:** **μT** (microtesla).

Earth’s magnetic field is what makes a compass work — the sensor feels that field plus any nearby metal/magnets.

---

## Why does it exists?

- **Compass / direction** — find north
- **Maps** — which way the user is facing
- **AR** — align virtual objects with the real world
- **Metal detection** — nearby magnetic objects

---

## vs Accelerometer & Gyroscope

| Sensor | Measures | Compass app uses it for |
|--------|----------|-------------------------|
| Accelerometer | Tilt / gravity (g) | Not used here |
| Gyroscope | Rotation speed (rad/s) | Not used here |
| **Magnetometer** | Magnetic field (μT) | **Heading → needle** |

---

## Real-world examples

1. **Compass app** (this project)
2. **Google Maps** — blue cone showing facing direction
3. **AR navigation** — “turn north”
4. **Stud finders / metal detectors** — strong field changes

---

## How to use with Expo (Android + Expo Go 55)

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { Magnetometer } from "expo-sensors";
```

### Basic flow

```ts
const ok = await Magnetometer.isAvailableAsync();
if (!ok) return;

Magnetometer.setUpdateInterval(100);

const sub = Magnetometer.addListener(({ x, y, z }) => {
  console.log(x, y, z);
});

sub.remove();
```

### Compass heading from x and y

When the phone is **flat** (portrait, screen up):

```ts
// Android (this project)
const radians = Math.atan2(-x, -y);
const degrees = (radians * 180) / Math.PI;
const heading = (degrees + 360) % 360;
```

Then rotate the needle:

```ts
transform: [{ rotate: `${-heading}deg` }]
```

**atan2** is the only “math” you need for a simple compass — it converts x,y into an angle.

### Android notes

- Works in **Expo Go 55** on a **real device**
- Stay away from magnets, speakers, and thick metal tables
- Hold phone **level** for steadiest heading
- Tilting the phone a lot can confuse raw x/y (advanced apps use sensor fusion)

---

## Mostly used APIs

| API | Purpose |
|-----|---------|
| `Magnetometer.isAvailableAsync()` | Check before subscribing |
| `Magnetometer.setUpdateInterval(ms)` | How often you get new x,y,z |
| `Magnetometer.addListener(callback)` | Stream readings |
| `subscription.remove()` | Stop listening |
| `MagnetometerUncalibrated` | Raw uncalibrated data (advanced) |

Same permission helpers as other sensors: `getPermissionsAsync`, `requestPermissionsAsync`, `PermissionStatus`.

---

## Types

### `MagnetometerMeasurement`

| Field | Type | Meaning |
|-------|------|---------|
| `x` | `number` | μT on X |
| `y` | `number` | μT on Y |
| `z` | `number` | μT on Z |
| `timestamp` | `number` | Seconds |

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-magnetometer.ts` | x, y, z + `heading` from atan2 |
| `src/components/compass.tsx` | UI + rotating needle |
| `src/app/index.tsx` | Home screen |

---

## What to try on your Android phone

1. Open app in Expo Go, hold phone **flat**
2. Rotate your body slowly — **heading** changes, red needle follows north
3. Watch **x** and **y** change as you turn
4. Move near metal — values jump (magnetic interference)

---

## Production note

Real compass apps sometimes use `Location.watchHeadingAsync()` for tilt-corrected heading. This project uses **Magnetometer** on purpose so you learn the sensor directly.
