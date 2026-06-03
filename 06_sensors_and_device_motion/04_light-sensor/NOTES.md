# Light Sensor — Learning Notes (Expo SDK 55, Android, Expo Go)

Docs: [LightSensor](https://docs.expo.dev/versions/v55.0.0/sdk/light-sensor/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is the light sensor?

The **light sensor** (ambient light sensor) measures **how bright** the environment is around the phone.

In Expo you get one main number:

| Value | Unit | Meaning |
|-------|------|---------|
| **illuminance** | **lux (lx)** | Ambient light level |

- **Dark room** → low lux (often under 10)
- **Normal indoor** → hundreds of lux
- **Bright sun** → thousands of lux

Unlike accelerometer/gyro/magnetometer, there are **no x, y, z** — just **illuminance**.

---

## Why does it exist?

- **Auto screen brightness** — dim in dark, bright in sunlight
- **Power saving** — adjust display backlight
- **Camera** — estimate exposure
- **Smart home / apps** — “is it day or night?”

---

## vs other sensors

| Sensor | Measures | Platforms in Expo |
|--------|----------|-------------------|
| Accelerometer | Tilt (g) | Android, iOS, Web |
| Gyroscope | Spin (rad/s) | Android, iOS, Web |
| Magnetometer | Magnetic field (μT) | Android, iOS |
| **LightSensor** | **Brightness (lux)** | **Android only** |

---

## Real-world examples

1. **Auto-brightness** on your phone
2. **Adaptive display** in dark mode
3. **Outdoor vs indoor** detection in apps
4. **Energy apps** — daylight harvesting

---

## How to use with Expo (Android + Expo Go 55)

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { LightSensor } from "expo-sensors";
```

### Basic flow

```ts
const ok = await LightSensor.isAvailableAsync();
if (!ok) return;

LightSensor.setUpdateInterval(100); // new lux every 100ms

const sub = LightSensor.addListener(({ illuminance }) => {
  console.log(illuminance, "lx");
});

sub.remove();
```

### Android-only

Expo’s `LightSensor` works on **Android only** (not iOS in Expo).  
Use a **real Android phone** with **Expo Go 55**.

The sensor is usually near the **front camera** / top of the screen — cover it with your finger to see lux drop.

### `setUpdateInterval(100)`

Same idea as other sensors: **100** = about 10 updates per second.

---

## Mostly used APIs

| API | Purpose |
|-----|---------|
| `LightSensor.isAvailableAsync()` | Check before subscribing |
| `LightSensor.setUpdateInterval(ms)` | How often you get new lux |
| `LightSensor.addListener(callback)` | Stream `{ illuminance, timestamp }` |
| `subscription.remove()` | Stop listening |
| `getPermissionsAsync()` / `requestPermissionsAsync()` | Permissions |

---

## Types

### `LightSensorMeasurement`

| Field | Type | Meaning |
|-------|------|---------|
| `illuminance` | `number` | Light level in **lux (lx)** |
| `timestamp` | `number` | Time in **seconds** |

### `PermissionStatus`

`GRANTED` · `DENIED` · `UNDETERMINED`

---

## This project’s core idea

```ts
const barWidth = (lux / MAX_LUX_FOR_BAR) * 100; // percent, capped at 100
```

More light → higher lux → wider yellow bar.  
Labels: Dark / Dim / Indoor / Bright.

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-light-sensor.ts` | Subscribe, expose `lux` |
| `src/components/light-meter.tsx` | Show lux + brightness bar |
| `src/app/index.tsx` | Home screen |

---

## What to try on your Android phone

1. Open app in Expo Go  
2. Note lux in a normal room  
3. Cover the top/front sensor with your finger → lux goes **down**  
4. Point toward a lamp or window → lux goes **up**  

---

## Rough lux reference

| Situation | Typical lux |
|-----------|-------------|
| Moonlight | ~1 |
| Dark room | 1–10 |
| Living room | 100–300 |
| Office | 300–500 |
| Overcast day | 1,000+ |
| Direct sun | 10,000+ |

Values vary by device — use relative changes when learning.
