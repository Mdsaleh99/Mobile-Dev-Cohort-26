# Expo Sensors — In-Depth Guide

> **Package:** `expo-sensors` · **Version:** ~55.0.x  
> **Platforms:** Android · iOS · Web (per sensor)

---

## Table of Contents

1. [Installation & Configuration](#1-installation--configuration)
2. [How Phone Sensors Actually Work](#2-how-phone-sensors-actually-work)
3. [The Coordinate System — Understanding X, Y, Z](#3-the-coordinate-system--understanding-x-y-z)
4. [Units Explained From Scratch](#4-units-explained-from-scratch)
5. [Accelerometer](#5-accelerometer)
6. [Gyroscope](#6-gyroscope)
7. [DeviceMotion](#7-devicemotion)
8. [Magnetometer](#8-magnetometer)
9. [LightSensor](#9-lightsensor)
10. [Pedometer](#10-pedometer)
11. [Permissions — Android & iOS](#11-permissions--android--ios)
12. [Update Intervals & Performance](#12-update-intervals--performance)
13. [Sensor Fusion — Combining Sensors](#13-sensor-fusion--combining-sensors)
14. [Reusable Hooks & Patterns](#14-reusable-hooks--patterns)
15. [Full API Quick Reference](#15-full-api-quick-reference)

---

## 1. Installation & Configuration

### Install the package

```bash
npx expo install expo-sensors
```

For bare React Native projects, also install the Expo modules core:

```bash
npx expo install expo
```

### Configure permissions via app.json

The config plugin sets the iOS motion permission string at build time. This is required — without it, iOS will silently refuse motion sensor access or crash.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ]
    ]
  }
}
```

Set `"motionPermission": false` if your app only uses LightSensor or Pedometer and doesn't need motion data.

For bare projects, add this manually to `ios/[AppName]/Info.plist`:

```xml
<key>NSMotionUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your device motion</string>
```

### Importing sensors

```ts
// Import everything (fine for small apps)
import * as Sensors from 'expo-sensors';

// Import only what you need (better — reduces bundle size)
import {
  Accelerometer,
  DeviceMotion,
  Gyroscope,
  LightSensor,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
} from 'expo-sensors';
```

---

## 2. How Phone Sensors Actually Work

Before using sensors in code, it helps to understand what's happening physically inside the device.

### MEMS sensors

Modern phones use **MEMS** (Micro-Electro-Mechanical Systems) sensors — tiny mechanical structures etched onto silicon chips, smaller than a grain of sand. The accelerometer has microscopic proof masses suspended on springs. When the phone moves, the mass shifts, changing capacitance between electrodes, which is measured as an electrical signal.

The gyroscope works differently — it uses the **Coriolis effect**. A vibrating mass deflects when the device rotates. That deflection is measured electronically and converted to rotation rate.

### Raw vs processed data

The hardware delivers raw electrical readings. These go through several layers before reaching your app:

```
Hardware sensor → ADC (analog-to-digital) → Kernel driver → OS sensor service → Calibration → Your app
```

The OS applies:
- **Offset correction** — removing constant bias from zero
- **Scale correction** — mapping voltage to physical units
- **Temperature compensation** — sensors drift with temperature
- **Calibration** — for magnetometer especially, correcting for device-specific magnetic distortion

When you use `DeviceMotion`, the OS also does **sensor fusion** — combining multiple sensors to produce output that's cleaner than any single sensor alone.

### Why sensors are noisy

Every measurement has noise — small random fluctuations caused by thermal motion of electrons, mechanical vibration, manufacturing imperfections. This is why you should never use a single raw reading for decisions. Instead: average, filter, or sample over time.

---

## 3. The Coordinate System — Understanding X, Y, Z

All sensors that return `x`, `y`, `z` values use the same coordinate system. Understanding this is critical because the numbers only make sense once you know which direction each axis points.

### Device-fixed axes (portrait orientation as reference)

```
         Top of phone
              ↑
              | +Y
              |
Left ←--------+--------→ Right
   -X         |         +X
              |
              ↓ -Y
         Bottom of phone

  +Z points OUT of the screen toward your face
  -Z points INTO the screen away from you
```

Concrete rules:
- **+X** = toward the right edge of the phone
- **+Y** = toward the top edge of the phone (home button is at bottom, camera at top)
- **+Z** = pointing out of the screen, toward the person looking at it

### This coordinate system rotates with the device

This is the most important thing to understand. These axes are **fixed to the phone**, not to the world. When you rotate the phone, the axes rotate with it.

So if you hold the phone in portrait and tilt it to the right, what was the X axis is now partially pointing downward. The raw sensor readings change accordingly.

This is why `DeviceMotion` is often more useful — it gives you orientation relative to the **world**, not the device.

### Visualizing with examples

**Phone flat on table, screen facing up:**
```
+Z is pointing up (toward the ceiling)
+Y is pointing away from you (toward the top edge)
+X is pointing to the right
```

**Phone held upright in portrait:**
```
+Y is pointing up (toward the ceiling)
+Z is pointing toward your face
+X is pointing to the right (same as before)
```

**Phone rotated to landscape (home button on the right):**
```
+X is now pointing up (toward the ceiling)
+Y is pointing toward your face
+Z is pointing to the right
```

---

## 4. Units Explained From Scratch

Each sensor outputs numbers in specific units. This section explains every unit in plain terms, including why they are what they are.

---

### g-force (g) — used by Accelerometer

#### What is a "g"?

A `g` (lowercase) is a unit of acceleration. **1 g = 9.81 m/s²**, which is the strength of Earth's gravitational pull at sea level.

The key insight: the accelerometer doesn't measure acceleration the way physics defines it. It measures **specific force** — the force per unit mass that a surface exerts on the sensor. When the phone is sitting still on a table, the table pushes back against gravity, and the sensor measures that push.

#### The resting phone paradox

This is what confuses most people:

- You'd expect a stationary phone to read `{x:0, y:0, z:0}` since it's not moving.
- But it actually reads about `{x:0, y:0, z:1}`.

Why? Because gravity is always pulling the phone downward, and the table is always pushing back with exactly 1g of normal force. The accelerometer senses that push. The sensor is essentially measuring "how hard is the surface beneath me pushing against me."

If you dropped the phone (free fall), gravity and the sensor would accelerate together — no surface pushing back — so you'd get `{x:0, y:0, z:0}`. That's why free fall = zero on an accelerometer, which is physically backwards from intuition.

#### Reading the values

| Phone position | x | y | z | Why |
|---|---|---|---|---|
| Flat, screen up | ~0 | ~0 | ~+1 | Z axis is vertical, table pushes up in +Z |
| Flat, screen down | ~0 | ~0 | ~-1 | Z axis is vertical but flipped, push is in -Z |
| Portrait upright | ~0 | ~+1 | ~0 | Y axis is now vertical, gravity reacts in +Y |
| Portrait upside-down | ~0 | ~-1 | ~0 | Y axis vertical, flipped |
| Landscape (right side up) | ~+1 | ~0 | ~0 | X axis is now vertical |
| 45° tilt to the right | ~+0.7 | ~0 | ~+0.7 | Force split between X and Z |
| Free fall | ~0 | ~0 | ~0 | No surface reaction force |
| Shaken hard | large spikes | large spikes | large spikes | Rapid movement |

#### The math behind tilted readings

When the phone is tilted, gravity's reaction force splits across multiple axes. If the phone is tilted at angle θ from horizontal:

```
z = cos(θ)   // decreases as you tilt more
y = sin(θ)   // increases as you tilt more
```

So a 45° tilt: cos(45°) = 0.707, sin(45°) = 0.707 — which is why you see ~0.7 on both axes.

#### Conversions

```ts
// g to m/s²
const gForce = 1.5;
const ms2 = gForce * 9.81;         // 14.715 m/s²

// m/s² to g
const acceleration = 19.62;
const g = acceleration / 9.81;     // 2.0 g

// Total magnitude (useful for shake detection — ignores direction)
const magnitude = Math.sqrt(x**2 + y**2 + z**2); // in g
```

---

### rad/s (radians per second) — used by Gyroscope

#### What is a radian?

A radian is a way to measure angles. While degrees divide a circle into 360 equal parts, radians relate angle to the actual arc length on a circle.

```
One radian = the angle where the arc length equals the radius

Full circle = 2π radians = 6.2832 radians = 360°
Half circle = π radians  = 3.1416 radians = 180°
Quarter     = π/2 radians = 1.5708 radians = 90°
```

Physics and math use radians because they make formulas cleaner (no conversion constants needed).

#### What rad/s means

The gyroscope outputs **rotational speed** — not the current angle, but how fast the angle is changing right now.

```
rad/s = radians per second = how many radians of rotation per second
```

Concrete examples:
- `x: 0` — phone is not rotating around X axis
- `x: 3.14` — phone is rotating around X at π rad/s = 180°/s = half rotation per second
- `x: 6.28` — phone is doing one full rotation per second around X
- `x: -1.57` — rotating in the opposite direction at ~90°/s

#### Conversions

```ts
const RAD_TO_DEG = 180 / Math.PI;  // ≈ 57.2958
const DEG_TO_RAD = Math.PI / 180;  // ≈ 0.01745

// rad/s to deg/s
const rotationRateRad = 1.57; // rad/s
const rotationRateDeg = rotationRateRad * RAD_TO_DEG; // ≈ 90°/s

// deg/s to rad/s
const rotDeg = 360; // deg/s = one full rotation per second
const rotRad = rotDeg * DEG_TO_RAD; // ≈ 6.28 rad/s
```

#### Getting angle from rotation rate (integration)

The gyroscope tells you the rate of change, not the current angle. To get the angle, you integrate (accumulate) over time:

```
angle = angle + (rotationRate × timeElapsed)
```

In code:

```ts
let angleX = 0; // current angle in radians
let prevTimestamp: number | null = null;

Gyroscope.addListener(({ x, timestamp }) => {
  if (prevTimestamp === null) {
    prevTimestamp = timestamp;
    return;
  }

  const dt = timestamp - prevTimestamp; // time elapsed in seconds
  prevTimestamp = timestamp;

  angleX += x * dt; // integrate: angle grows by (rate × time)

  console.log(`Angle: ${(angleX * RAD_TO_DEG).toFixed(1)}°`);
});
```

#### The drift problem

Integration accumulates small errors. If the gyroscope has a tiny constant offset (bias) of 0.01 rad/s, over 100 seconds your angle estimate will be off by 1 radian (57°). This is called **gyroscope drift**.

Solutions:
- Use `DeviceMotion` which handles drift correction internally
- Combine with accelerometer using a complementary filter (see Section 13)
- Apply zero-rate offset calibration during a "still" moment

---

### m/s² (meters per second squared) — used by DeviceMotion

This is the standard physics unit for acceleration. It tells you how quickly velocity is changing.

```
1 m/s² = the object gains 1 meter/second of speed every second
9.81 m/s² = gravitational acceleration on Earth (= 1 g)
```

DeviceMotion uses m/s² instead of g for its motion fields. The conversion is just multiplication:

```ts
const GRAVITY = 9.80665; // DeviceMotion.Gravity constant

// g to m/s²
const inGs = 1.5;
const inMs2 = inGs * GRAVITY; // 14.71 m/s²

// m/s² to g
const inMs2_2 = 14.71;
const inGs_2 = inMs2_2 / GRAVITY; // ≈ 1.5 g
```

DeviceMotion gives you two acceleration fields:
- `acceleration` — user-motion only, **gravity removed**. Zero when phone is still.
- `accelerationIncludingGravity` — raw measurement, **gravity included**. ~9.81 m/s² on one axis when still.

---

### degrees (°) and deg/s — used by DeviceMotion rotation

DeviceMotion uses **Euler angles** to describe 3D orientation. Euler angles represent rotation as three separate angles around three axes.

```
alpha (α) = rotation around Z axis  → "yaw"   → range: 0° to 360°
beta  (β) = rotation around X axis  → "pitch" → range: -180° to 180°
gamma (γ) = rotation around Y axis  → "roll"  → range: -90° to 90°
```

Think of a plane:
- **Yaw (alpha)** — nose turning left or right. On a phone: which compass direction it's facing.
- **Pitch (beta)** — nose pointing up or down. On a phone: tilting the top toward or away from you.
- **Roll (gamma)** — one wing going up, other going down. On a phone: tilting left or right.

```
Portrait phone, held in front of you:
  alpha = compass heading (0° = north, 90° = east, etc.)
  beta  = how far it's tilted toward/away from you (0° = flat, 90° = vertical toward you)
  gamma = how far it's tilted left/right (0° = vertical, +45° = tilted right)
```

`rotationRate` is the same angles but as rates (deg/s) — how fast each angle is changing.

---

### μT (microteslas) — used by Magnetometer

A tesla (T) is the SI unit for magnetic flux density — how strong a magnetic field is. A microtesla is one millionth of a tesla.

```
1 T = 1 tesla (very strong — MRI machines use 1.5–3 T)
1 μT = 0.000001 T (weak — ambient fields around phones)
```

Reference magnetic field strengths:

| Source | Approximate strength |
|---|---|
| Earth's magnetic field | 25–65 μT (varies by location) |
| Earth at the poles | ~60 μT |
| Earth at the equator | ~30 μT |
| Typical phone at rest | ~40–60 μT |
| Near a speaker | 200–1000+ μT |
| Near a strong magnet | 1000+ μT |
| MRI machine | 1,500,000,000 μT (1.5 T) |

The Earth's field is weak but consistent in direction, which is why a compass works. The magnetometer reads the vector — x, y, z components of the total field. You compute the heading from those components.

#### Why calibration matters

The magnetometer is sensitive to nearby metal and magnets. Every device has small magnetic biases from its own components (speakers, battery, circuits). The calibrated `Magnetometer` API applies **hard-iron** and **soft-iron** corrections to remove these biases. Use uncalibrated only if you're implementing your own calibration.

#### Compass heading calculation

```ts
// Heading assuming phone is held flat (horizontal)
const heading = Math.atan2(y, x) * (180 / Math.PI);
const normalized = (heading + 360) % 360; // convert to 0–360°

// 0° = magnetic East (atan2 convention)
// To make 0° = North (compass convention), subtract 90:
const compassHeading = (normalized - 90 + 360) % 360;
```

---

### lux (lx) — used by LightSensor

Lux measures **illuminance** — the amount of visible light hitting a surface per unit area.

```
1 lux = 1 lumen per square meter
```

Think of a lumen as one "candle-worth" of light spread over 1 square meter of surface. More lumens concentrated on a smaller area = more lux.

Real-world reference scale:

| Environment | Lux range |
|---|---|
| Moonless night, no stars | 0.0001 lx |
| Full moon, clear night | 0.1 lx |
| Very dark room | 1–5 lx |
| Living room in evening | 50–100 lx |
| Office with good lighting | 300–500 lx |
| Sunrise/sunset | 400 lx |
| Overcast day outdoors | 1,000 lx |
| Full daylight (no direct sun) | 10,000–25,000 lx |
| Direct sunlight | 50,000–130,000 lx |

The phone's ambient light sensor (the tiny dot above the earpiece) measures this and your app reads it via `LightSensor.illuminance`.

---

## 5. Accelerometer

**Platforms:** Android · iOS (device only) · Web  
**Unit:** g-force (g), where 1 g = 9.81 m/s²  
**What it measures:** All forces on the device — includes gravity, user motion, vibration

The accelerometer is the most fundamental motion sensor. It cannot separate gravity from user-caused acceleration on its own — it measures the total reaction force. If you need gravity-removed acceleration, use DeviceMotion.

### Setting up

```tsx
import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function AccelerometerDemo() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const subRef = useRef<any>(null);

  useEffect(() => {
    // Step 1: always check availability before using
    Accelerometer.isAvailableAsync().then(ok => {
      setAvailable(ok);
    });

    return () => subRef.current?.remove();
  }, []);

  const subscribe = () => {
    Accelerometer.setUpdateInterval(100); // 10 updates per second
    subRef.current = Accelerometer.addListener(measurement => {
      setData(measurement);
    });
    setIsSubscribed(true);
  };

  const unsubscribe = () => {
    subRef.current?.remove();
    subRef.current = null;
    setIsSubscribed(false);
  };

  const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

  if (available === false) return <Text>Accelerometer not available on this device.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Accelerometer (g-force)</Text>

      <Text>X: {data.x.toFixed(4)} g  (left ← → right)</Text>
      <Text>Y: {data.y.toFixed(4)} g  (down ↓ ↑ up)</Text>
      <Text>Z: {data.z.toFixed(4)} g  (back → screen → face)</Text>
      <Text>Magnitude: {magnitude.toFixed(4)} g</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={isSubscribed ? unsubscribe : subscribe}
      >
        <Text>{isSubscribed ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  button: { marginTop: 20, padding: 12, backgroundColor: '#ddd', alignItems: 'center' },
});
```

### Shake detection

A shake is when the **total magnitude** of acceleration exceeds some threshold significantly above 1g (gravity). The phone at rest has a magnitude of ~1g. A shake spikes it to 2–4g or more.

```ts
import { Accelerometer } from 'expo-sensors';

const SHAKE_THRESHOLD = 2.0; // g — tune this for your use case
const COOLDOWN_MS = 800;     // prevent multiple triggers per shake

let lastShakeTime = 0;

function startShakeDetection(onShake: () => void) {
  Accelerometer.setUpdateInterval(50); // 20 Hz is enough for shake detection

  return Accelerometer.addListener(({ x, y, z }) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (magnitude > SHAKE_THRESHOLD) {
      const now = Date.now();
      if (now - lastShakeTime > COOLDOWN_MS) {
        lastShakeTime = now;
        onShake();
      }
    }
  });
}

// Usage
const sub = startShakeDetection(() => {
  console.log('Shake detected!');
});

// Later: sub.remove()
```

### Tilt angle detection

When the phone is **stationary**, the accelerometer only reads gravity. You can use trigonometry to recover the tilt angle from the axis readings.

```ts
import { Accelerometer } from 'expo-sensors';

Accelerometer.addListener(({ x, y, z }) => {
  // These formulas only give correct angles when the phone is NOT moving.
  // During motion, the values include both gravity and acceleration noise.

  // Tilt around X axis: how far the phone is tilted forward/backward
  // 0° = phone flat, 90° = phone standing upright in portrait
  const pitchRad = Math.atan2(y, Math.sqrt(x * x + z * z));
  const pitch = pitchRad * (180 / Math.PI);

  // Tilt around Y axis: how far the phone is tilted left/right
  // 0° = phone flat, 90° = phone on its right edge
  const rollRad = Math.atan2(x, Math.sqrt(y * y + z * z));
  const roll = rollRad * (180 / Math.PI);

  console.log(`Pitch: ${pitch.toFixed(1)}°  Roll: ${roll.toFixed(1)}°`);
});
```

### Step counting from accelerometer (manual method)

The accelerometer can be used to count steps manually — useful if you don't have access to Pedometer (e.g., web). Steps create a rhythmic vertical bounce.

```ts
import { Accelerometer } from 'expo-sensors';

// Simple peak detection for step counting
let stepCount = 0;
let lastMagnitude = 1;
let isStepUp = false;
const STEP_THRESHOLD_HIGH = 1.2; // peak threshold (g)
const STEP_THRESHOLD_LOW = 0.8;  // valley threshold (g)

Accelerometer.setUpdateInterval(50); // 20 Hz

Accelerometer.addListener(({ x, y, z }) => {
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  // Detect rising past the high threshold
  if (!isStepUp && lastMagnitude < STEP_THRESHOLD_HIGH && magnitude >= STEP_THRESHOLD_HIGH) {
    isStepUp = true;
  }

  // After rising, detect the fall back below the low threshold — that's one step
  if (isStepUp && magnitude < STEP_THRESHOLD_LOW) {
    isStepUp = false;
    stepCount++;
    console.log(`Steps: ${stepCount}`);
  }

  lastMagnitude = magnitude;
});
```

> For accurate step counting on Android and iOS, always prefer the dedicated `Pedometer` API — it uses a hardware chip designed for this.

### API Reference

```ts
// Types
type AccelerometerMeasurement = {
  x: number;         // g-force on X axis (left/right)
  y: number;         // g-force on Y axis (up/down)
  z: number;         // g-force on Z axis (into/out of screen)
  timestamp: number; // time of measurement in seconds
};

// Methods
Accelerometer.addListener(listener: (data: AccelerometerMeasurement) => void): EventSubscription
Accelerometer.setUpdateInterval(intervalMs: number): void
Accelerometer.isAvailableAsync(): Promise<boolean>
Accelerometer.getPermissionsAsync(): Promise<PermissionResponse>
Accelerometer.requestPermissionsAsync(): Promise<PermissionResponse>
Accelerometer.getListenerCount(): number
Accelerometer.hasListeners(): boolean
Accelerometer.removeAllListeners(): void

// Subscription
subscription.remove(): void
```

---

## 6. Gyroscope

**Platforms:** Android · iOS (device only) · Web  
**Unit:** rad/s (radians per second)  
**What it measures:** Rotational velocity — how fast the device is spinning around each axis

The gyroscope is about **rotation only**, not position or movement through space. A phone sliding across a table with no rotation would read `{x:0, y:0, z:0}`. A phone spinning in place would show large values.

### Which axis is which rotation

```
X axis rotation (gyro.x) — phone tilting forward/backward (like nodding your head)
Y axis rotation (gyro.y) — phone tilting left/right (like shaking your head "no")
Z axis rotation (gyro.z) — phone spinning flat on the table (like a compass needle)
```

Sign convention (right-hand rule):
- Positive values = counter-clockwise rotation when looking from the positive end of the axis toward the origin
- In practice: positive gyro.z means spinning counter-clockwise when viewing the screen

### Basic usage

```tsx
import { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const RAD_TO_DEG = 180 / Math.PI;

export default function GyroscopeDemo() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const subRef = useRef<any>(null);

  useEffect(() => {
    Gyroscope.setUpdateInterval(16); // ~60 Hz for smooth response
    subRef.current = Gyroscope.addListener(setData);
    return () => subRef.current?.remove();
  }, []);

  return (
    <View>
      <Text>Gyroscope (rotation speed)</Text>
      <Text>X (forward/back tilt): {(data.x * RAD_TO_DEG).toFixed(1)}°/s</Text>
      <Text>Y (left/right tilt):   {(data.y * RAD_TO_DEG).toFixed(1)}°/s</Text>
      <Text>Z (flat spin):         {(data.z * RAD_TO_DEG).toFixed(1)}°/s</Text>
    </View>
  );
}
```

### Tracking cumulative rotation angle

```tsx
import { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const RAD_TO_DEG = 180 / Math.PI;

export default function RotationTracker() {
  const [angle, setAngle] = useState({ x: 0, y: 0, z: 0 });
  const angleRef = useRef({ x: 0, y: 0, z: 0 });
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    Gyroscope.setUpdateInterval(16);

    const sub = Gyroscope.addListener(({ x, y, z, timestamp }) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
        return;
      }

      // dt = time elapsed since last reading, in seconds
      const dt = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      // Integrate: new angle = old angle + (rate × time)
      angleRef.current = {
        x: angleRef.current.x + x * dt,
        y: angleRef.current.y + y * dt,
        z: angleRef.current.z + z * dt,
      };

      setAngle({ ...angleRef.current });
    });

    return () => sub.remove();
  }, []);

  return (
    <View>
      <Text>Cumulative rotation (subject to drift):</Text>
      <Text>X: {(angle.x * RAD_TO_DEG).toFixed(1)}°</Text>
      <Text>Y: {(angle.y * RAD_TO_DEG).toFixed(1)}°</Text>
      <Text>Z: {(angle.z * RAD_TO_DEG).toFixed(1)}°</Text>
    </View>
  );
}
```

### Gesture recognition — detecting a wrist flick

```ts
import { Gyroscope } from 'expo-sensors';

const FLICK_THRESHOLD = 8.0; // rad/s — tune this
const FLICK_DURATION_MS = 300;

let flickStart: number | null = null;
let flickAxis: string | null = null;

Gyroscope.setUpdateInterval(16);

Gyroscope.addListener(({ x, y, z, timestamp }) => {
  const now = timestamp * 1000; // convert to ms if needed

  // Check for fast rotation on any axis
  if (Math.abs(z) > FLICK_THRESHOLD) {
    if (flickStart === null) {
      flickStart = Date.now();
      flickAxis = z > 0 ? 'counter-clockwise' : 'clockwise';
    }
  } else {
    if (flickStart !== null) {
      const duration = Date.now() - flickStart;
      if (duration < FLICK_DURATION_MS) {
        console.log(`Flick detected: ${flickAxis} in ${duration}ms`);
      }
      flickStart = null;
      flickAxis = null;
    }
  }
});
```

### API Reference

```ts
type GyroscopeMeasurement = {
  x: number;         // rad/s — rotation around X (forward/back tilt)
  y: number;         // rad/s — rotation around Y (left/right tilt)
  z: number;         // rad/s — rotation around Z (flat spin)
  timestamp: number; // seconds
};

// Methods are identical to Accelerometer
Gyroscope.addListener(listener): EventSubscription
Gyroscope.setUpdateInterval(intervalMs): void
Gyroscope.isAvailableAsync(): Promise<boolean>
Gyroscope.getPermissionsAsync(): Promise<PermissionResponse>
Gyroscope.requestPermissionsAsync(): Promise<PermissionResponse>
```

---

## 7. DeviceMotion

**Platforms:** Android · iOS · Web  
**Units:** m/s² (acceleration), degrees (rotation), deg/s (rotation rate)  
**What it measures:** A fused, clean view of full 3D motion and orientation

DeviceMotion is built on top of all other motion sensors. The OS combines the accelerometer, gyroscope, and (on some devices) magnetometer to produce output that's more accurate and stable than any single sensor alone. It's the sensor to use when you want reliable orientation data without implementing your own sensor fusion.

### The `Gravity` constant

```ts
import { DeviceMotion } from 'expo-sensors';

// Standard gravitational acceleration for Earth: 9.80665 m/s²
console.log(DeviceMotion.Gravity); // 9.80665
```

This constant is available at both the class level (`DeviceMotion.Gravity`) and as a top-level export.

### The full measurement object

`DeviceMotionMeasurement` has five fields. Here's every one explained:

```ts
type DeviceMotionMeasurement = {
  // 1. acceleration: user-caused motion, gravity removed
  //    Unit: m/s²
  //    Phone resting still → { x:0, y:0, z:0 }
  //    Phone being pushed right at 1 m/s² → { x:1, y:0, z:0 }
  //    Can be null if the device cannot remove gravity
  acceleration: { x: number; y: number; z: number; timestamp: number } | null;

  // 2. accelerationIncludingGravity: raw sensor, gravity included
  //    Unit: m/s²
  //    Phone flat, screen up → { x:0, y:0, z:9.81 }
  //    Phone in portrait → { x:0, y:9.81, z:0 }
  accelerationIncludingGravity: { x: number; y: number; z: number; timestamp: number };

  // 3. rotation: absolute orientation in space (Euler angles)
  //    Unit: degrees
  //    alpha: yaw — rotation around Z — 0° to 360° — like a compass heading
  //    beta:  pitch — rotation around X — -180° to 180° — forward/back tilt
  //    gamma: roll — rotation around Y — -90° to 90° — left/right tilt
  rotation: { alpha: number; beta: number; gamma: number; timestamp: number };

  // 4. rotationRate: how fast the rotation angles are changing
  //    Unit: degrees per second
  //    alpha, beta, gamma same axes as rotation
  //    Can be null if not available
  rotationRate: { alpha: number; beta: number; gamma: number; timestamp: number } | null;

  // 5. orientation: which way the screen is rotated (based on gravity)
  //    Values: 0 (portrait) | 90 (right landscape) | -90 (left landscape) | 180 (upside-down)
  orientation: DeviceMotionOrientation;
};
```

### Full example with all fields

```tsx
import { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

export default function DeviceMotionDemo() {
  const [motion, setMotion] = useState<DeviceMotionMeasurement | null>(null);

  useEffect(() => {
    DeviceMotion.isAvailableAsync().then(available => {
      if (!available) return;
      DeviceMotion.setUpdateInterval(100);
      const sub = DeviceMotion.addListener(setMotion);
      return () => sub.remove();
    });
  }, []);

  if (!motion) return <Text>Waiting for motion data...</Text>;

  const { acceleration, accelerationIncludingGravity, rotation, rotationRate, orientation } = motion;

  const orientationLabel = {
    0: 'Portrait',
    90: 'Right Landscape',
    [-90]: 'Left Landscape',
    180: 'Upside Down',
  }[orientation] ?? 'Unknown';

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>DeviceMotion</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 12 }}>
        Acceleration without gravity (m/s²)
      </Text>
      <Text>  Motion is zero when phone is still</Text>
      <Text>  X: {acceleration?.x.toFixed(3) ?? 'N/A'}</Text>
      <Text>  Y: {acceleration?.y.toFixed(3) ?? 'N/A'}</Text>
      <Text>  Z: {acceleration?.z.toFixed(3) ?? 'N/A'}</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 12 }}>
        Acceleration with gravity (m/s²)
      </Text>
      <Text>  ~9.81 on one axis when still</Text>
      <Text>  X: {accelerationIncludingGravity.x.toFixed(3)}</Text>
      <Text>  Y: {accelerationIncludingGravity.y.toFixed(3)}</Text>
      <Text>  Z: {accelerationIncludingGravity.z.toFixed(3)}</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 12 }}>
        Rotation — Euler Angles (°)
      </Text>
      <Text>  alpha (yaw / compass):  {rotation.alpha.toFixed(1)}°</Text>
      <Text>  beta  (pitch forward):  {rotation.beta.toFixed(1)}°</Text>
      <Text>  gamma (roll sideways):  {rotation.gamma.toFixed(1)}°</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 12 }}>
        Rotation Rate (°/s)
      </Text>
      <Text>  alpha: {rotationRate?.alpha.toFixed(1) ?? 'N/A'}</Text>
      <Text>  beta:  {rotationRate?.beta.toFixed(1) ?? 'N/A'}</Text>
      <Text>  gamma: {rotationRate?.gamma.toFixed(1) ?? 'N/A'}</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Screen Orientation</Text>
      <Text>  {orientationLabel} ({orientation}°)</Text>
    </ScrollView>
  );
}
```

### Building a spirit level

A spirit level tells you if a surface is perfectly flat. Beta and gamma should both be 0 when flat.

```tsx
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

export default function SpiritLevel() {
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50);
    const sub = DeviceMotion.addListener(({ rotation }) => {
      setBeta(rotation.beta);
      setGamma(rotation.gamma);
    });
    return () => sub.remove();
  }, []);

  const isLevel = Math.abs(beta) < 2 && Math.abs(gamma) < 2;

  return (
    <View style={styles.container}>
      {/* Bubble visualization */}
      <View style={styles.levelContainer}>
        <View
          style={[
            styles.bubble,
            {
              // Move bubble based on tilt: clamp within the level circle
              transform: [
                { translateX: Math.max(-60, Math.min(60, gamma * 2)) },
                { translateY: Math.max(-60, Math.min(60, beta * 2)) },
              ],
              backgroundColor: isLevel ? '#4caf50' : '#f44336',
            },
          ]}
        />
      </View>
      <Text>Forward/back (beta):  {beta.toFixed(1)}°</Text>
      <Text>Left/right (gamma):   {gamma.toFixed(1)}°</Text>
      <Text style={{ color: isLevel ? 'green' : 'red', fontWeight: 'bold', marginTop: 8 }}>
        {isLevel ? '✓ Level' : '✗ Not level'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  levelContainer: {
    width: 150, height: 150,
    borderRadius: 75,
    borderWidth: 2, borderColor: '#333',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  bubble: {
    width: 30, height: 30,
    borderRadius: 15,
  },
});
```

### DeviceMotionOrientation enum

```ts
import { DeviceMotionOrientation } from 'expo-sensors';

// Values:
DeviceMotionOrientation.Portrait       // 0   — normal portrait
DeviceMotionOrientation.RightLandscape // 90  — rotated clockwise
DeviceMotionOrientation.LeftLandscape  // -90 — rotated counter-clockwise
DeviceMotionOrientation.UpsideDown     // 180 — upside down
```

### iOS permission required

DeviceMotion requires `NSMotionUsageDescription` on iOS. See Section 11.

### API Reference

```ts
// Constant
DeviceMotion.Gravity: number // 9.80665

// Methods
DeviceMotion.addListener(listener: (data: DeviceMotionMeasurement) => void): EventSubscription
DeviceMotion.setUpdateInterval(intervalMs: number): void
DeviceMotion.isAvailableAsync(): Promise<boolean>
DeviceMotion.getPermissionsAsync(): Promise<PermissionResponse>
DeviceMotion.requestPermissionsAsync(): Promise<PermissionResponse>
```

---

## 8. Magnetometer

**Platforms:** Android · iOS (no Web)  
**Unit:** μT (microteslas)  
**What it measures:** Magnetic field vector — strength and direction of the ambient magnetic field

Two exports are available:
- **`Magnetometer`** — OS-calibrated values (use this for compass apps)
- **`MagnetometerUncalibrated`** — raw values with bias, useful for custom calibration

### How compass heading is computed

The magnetometer gives you the components of the magnetic field vector — how much of the field is pointing along each axis. To turn that into a compass heading, you compute the angle of the horizontal component of the field relative to North.

When the phone is held flat:
```ts
// atan2(y, x) gives the angle of the (x, y) vector
// in radians, ranging from -π to +π
const headingRad = Math.atan2(y, x);

// Convert to degrees, then normalize to 0–360
const headingDeg = (headingRad * (180 / Math.PI) + 360) % 360;

// atan2 convention: 0° = East, 90° = North, 180° = West, 270° = South
// To make 0° = North (standard compass):
const compassHeading = (headingDeg - 90 + 360) % 360;
```

### Full compass example with smoothing

Raw magnetometer data is noisy — applying an exponential moving average (EMA) smooths the output without adding much latency.

```tsx
import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const SMOOTH = 0.15; // EMA factor: lower = smoother, higher = more responsive

export default function Compass() {
  const [heading, setHeading] = useState(0);
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    Magnetometer.isAvailableAsync().then(available => {
      if (!available) return;

      Magnetometer.setUpdateInterval(100);

      const sub = Magnetometer.addListener(({ x, y }) => {
        // Apply low-pass filter to reduce noise
        smoothRef.current.x = SMOOTH * x + (1 - SMOOTH) * smoothRef.current.x;
        smoothRef.current.y = SMOOTH * y + (1 - SMOOTH) * smoothRef.current.y;

        const { x: sx, y: sy } = smoothRef.current;

        // Compute heading: angle of horizontal field component
        const headingRad = Math.atan2(sy, sx);
        const headingDeg = (headingRad * (180 / Math.PI) + 360) % 360;
        // Shift so 0° = North
        const compass = (headingDeg - 90 + 360) % 360;

        setHeading(compass);
      });

      return () => sub.remove();
    });
  }, []);

  const getCardinal = (deg: number) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <View style={styles.container}>
      {/* Rotating needle */}
      <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]} />
      <Text style={styles.heading}>{heading.toFixed(0)}°</Text>
      <Text style={styles.cardinal}>{getCardinal(heading)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  needle: { width: 4, height: 100, backgroundColor: 'red', marginBottom: 16 },
  heading: { fontSize: 32, fontWeight: 'bold' },
  cardinal: { fontSize: 24, color: '#555' },
});
```

### Detecting magnetic interference

```ts
Magnetometer.addListener(({ x, y, z }) => {
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  // Earth's natural field: 25–65 μT
  if (magnitude < 20) {
    console.log('Unusually weak field — may be shielded environment');
  } else if (magnitude > 100) {
    console.log(`Magnetic interference: ${magnitude.toFixed(0)} μT — compass unreliable`);
  } else {
    console.log(`Normal field: ${magnitude.toFixed(0)} μT`);
  }
});
```

### Calibrated vs uncalibrated

```ts
import { Magnetometer, MagnetometerUncalibrated } from 'expo-sensors';

// CALIBRATED — use this for all normal apps
// The OS has corrected for hard-iron (constant offset) and
// soft-iron (directional distortion from device components)
Magnetometer.addListener(({ x, y, z }) => {
  // Ready to use for heading computation
});

// UNCALIBRATED — raw hardware values
// Also includes estimated bias values (how much offset the OS detected)
// Use when you want to implement your own calibration algorithm
MagnetometerUncalibrated.addListener(({ x, y, z }) => {
  // x, y, z = raw values including hard-iron bias
  // The total corrected value = (x - biasX) etc.
  // Note: biasX/Y/Z are not separately exposed in Expo — you get the raw values only
});
```

### API Reference

```ts
type MagnetometerMeasurement = {
  x: number;         // μT — field strength on X axis
  y: number;         // μT — field strength on Y axis
  z: number;         // μT — field strength on Z axis
  timestamp: number; // seconds
};

Magnetometer.addListener(listener): EventSubscription
Magnetometer.setUpdateInterval(intervalMs): void
Magnetometer.isAvailableAsync(): Promise<boolean>
Magnetometer.getPermissionsAsync(): Promise<PermissionResponse>
Magnetometer.requestPermissionsAsync(): Promise<PermissionResponse>
// MagnetometerUncalibrated has the same API
```

Requires Android 2.3+ (API Level 9) and iOS 8+.

---

## 9. LightSensor

**Platforms:** Android only  
**Unit:** lux (lx)  
**What it measures:** Ambient illuminance — the brightness of light hitting the sensor

iOS does not expose the ambient light sensor to third-party apps. This API is Android-exclusive.

### Why the update interval matters here

Unlike motion sensors, light doesn't change rapidly. Polling at 60 Hz for light is wasteful and provides no benefit. Use 500ms–2000ms for most applications.

### Basic usage

```tsx
import { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import { LightSensor } from 'expo-sensors';

export default function AmbientLight() {
  const [illuminance, setIlluminance] = useState<number | null>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    LightSensor.isAvailableAsync().then(ok => {
      setAvailable(ok);
      if (!ok) return;

      LightSensor.setUpdateInterval(1000); // check once per second
      const sub = LightSensor.addListener(({ illuminance }) => {
        setIlluminance(illuminance);
      });

      return () => sub.remove();
    });
  }, []);

  if (Platform.OS !== 'android') {
    return <Text>LightSensor is Android-only. iOS doesn't expose this sensor.</Text>;
  }

  if (!available) {
    return <Text>Light sensor not available on this device.</Text>;
  }

  const describe = (lux: number) => {
    if (lux < 1)      return 'Very dark (night)';
    if (lux < 50)     return 'Dark room';
    if (lux < 200)    return 'Dim room';
    if (lux < 500)    return 'Normal indoor lighting';
    if (lux < 1000)   return 'Bright indoors';
    if (lux < 10000)  return 'Overcast daylight';
    if (lux < 30000)  return 'Bright daylight (shade)';
    return 'Direct sunlight';
  };

  return (
    <View>
      <Text>Illuminance: {illuminance?.toFixed(1) ?? '...'} lux</Text>
      <Text>Condition: {illuminance != null ? describe(illuminance) : '...'}</Text>
    </View>
  );
}
```

### Auto dark mode based on light level

```ts
import { LightSensor } from 'expo-sensors';
import { useColorScheme } from 'react-native';

const DARK_THRESHOLD = 30; // lux — below this, switch to dark mode

function setupAutoTheme(setDarkMode: (dark: boolean) => void) {
  LightSensor.setUpdateInterval(2000); // check every 2 seconds

  return LightSensor.addListener(({ illuminance }) => {
    setDarkMode(illuminance < DARK_THRESHOLD);
  });
}
```

### API Reference

```ts
type LightSensorMeasurement = {
  illuminance: number; // ambient light in lux
  timestamp: number;   // seconds
};

LightSensor.addListener(listener): EventSubscription
LightSensor.setUpdateInterval(intervalMs): void
LightSensor.isAvailableAsync(): Promise<boolean>   // Android 2.3+ required
LightSensor.getPermissionsAsync(): Promise<PermissionResponse>
LightSensor.requestPermissionsAsync(): Promise<PermissionResponse>
```

---

## 10. Pedometer

**Platforms:** Android · iOS  
**Unit:** integer step count  
**What it measures:** Number of steps taken

The Pedometer uses dedicated hardware: `hardware.Sensor.TYPE_STEP_COUNTER` on Android and Core Motion's CMPedometer on iOS. This hardware chip runs at very low power — far more efficient than counting steps manually via the accelerometer.

Two distinct modes:

| Mode | Method | iOS | Android | Notes |
|---|---|---|---|---|
| Live updates | `watchStepCount` | ✓ | ✓ | Fires as you walk, not in background |
| Historical query | `getStepCountAsync` | ✓ | ✗ | Past 7 days on iOS |

### Requesting permission first

On iOS (and in recent Android versions), you must request permission before accessing pedometer data.

```ts
import { Pedometer } from 'expo-sensors';

async function setupPedometer() {
  const isAvailable = await Pedometer.isAvailableAsync();
  if (!isAvailable) {
    console.log('Pedometer not available');
    return;
  }

  const { granted } = await Pedometer.requestPermissionsAsync();
  if (!granted) {
    console.log('Permission denied');
    return;
  }

  // Safe to use now
}
```

### Live step counting

```tsx
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function LiveStepCounter() {
  const [steps, setSteps] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0); // since app launched

  useEffect(() => {
    let sub: any;

    (async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) return;

      const { granted } = await Pedometer.requestPermissionsAsync();
      if (!granted) return;

      sub = Pedometer.watchStepCount(({ steps }) => {
        setSessionSteps(steps);
      });
    })();

    return () => sub?.remove();
  }, []);

  return (
    <View>
      <Text>Steps this session: {sessionSteps}</Text>
      <Text>Approx. distance: {(sessionSteps * 0.762 / 1000).toFixed(2)} km</Text>
      <Text>Approx. calories: {(sessionSteps * 0.04).toFixed(0)} kcal</Text>
    </View>
  );
}
```

### Historical step count (iOS only)

```tsx
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export default function StepHistory() {
  const [todaySteps, setTodaySteps] = useState<number | null>(null);
  const [weekSteps, setWeekSteps] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    (async () => {
      const { granted } = await Pedometer.requestPermissionsAsync();
      if (!granted) return;

      const now = new Date();

      // Today's steps: midnight to now
      const midnight = new Date(now);
      midnight.setHours(0, 0, 0, 0);
      const todayResult = await Pedometer.getStepCountAsync(midnight, now);
      setTodaySteps(todayResult?.steps ?? 0);

      // Last 7 days
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekResult = await Pedometer.getStepCountAsync(weekAgo, now);
      setWeekSteps(weekResult?.steps ?? 0);
    })();
  }, []);

  if (Platform.OS !== 'ios') {
    return <Text>Historical step data is iOS only. Use Health Connect on Android.</Text>;
  }

  return (
    <View>
      <Text>Today: {todaySteps ?? 'Loading...'} steps</Text>
      <Text>Last 7 days: {weekSteps ?? 'Loading...'} steps</Text>
      {weekSteps != null && (
        <Text>Daily average: {Math.round(weekSteps / 7)} steps/day</Text>
      )}
    </View>
  );
}
```

> **7-day limit:** Apple only stores the past 7 days. Requesting older data returns only what's available — no error is thrown.

### Background step counting

`watchStepCount` does **not** deliver updates in the background.

- **iOS:** When the app comes to the foreground, call `getStepCountAsync` with the last-known timestamp to catch up.
- **Android:** Use [Health Connect API](https://developer.android.com/health-and-fitness/guides/health-connect) for background/historical step data.

### API Reference

```ts
type PedometerResult = {
  steps: number; // total steps in the measured range
};

// Methods
Pedometer.isAvailableAsync(): Promise<boolean>
Pedometer.getPermissionsAsync(): Promise<PermissionResponse>
Pedometer.requestPermissionsAsync(): Promise<PermissionResponse>
Pedometer.watchStepCount(callback: (result: PedometerResult) => void): EventSubscription
Pedometer.getStepCountAsync(start: Date, end: Date): Promise<PedometerResult> // iOS only
```

---

## 11. Permissions — Android & iOS

### Android permissions

Most sensors require no explicit runtime permission on Android. The exception is **high-frequency sampling** (above 200 Hz) on Android 12+.

```json
// app.json — for update intervals below 5ms
{
  "expo": {
    "android": {
      "permissions": ["android.permission.HIGH_SAMPLING_RATE_SENSORS"]
    }
  }
}
```

```xml
<!-- android/app/src/main/AndroidManifest.xml (bare projects) -->
<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />
```

### iOS permissions

Motion sensor access on iOS requires `NSMotionUsageDescription` in `Info.plist`. Set it via the config plugin (managed workflow) or manually (bare workflow).

```xml
<!-- ios/[AppName]/Info.plist (bare projects) -->
<key>NSMotionUsageDescription</key>
<string>This app uses motion sensors for orientation and activity tracking.</string>
```

### Runtime permission flow

All sensors follow the same permission check pattern:

```ts
import { Accelerometer, PermissionStatus } from 'expo-sensors';

async function ensurePermission(): Promise<boolean> {
  // 1. Check current status without prompting
  const { status } = await Accelerometer.getPermissionsAsync();

  if (status === PermissionStatus.GRANTED) {
    return true; // already have it
  }

  if (status === PermissionStatus.DENIED) {
    // User already said no — can't prompt again without Settings
    // Show a message directing them to Settings
    return false;
  }

  // status === 'undetermined' — ask for the first time
  const { status: newStatus } = await Accelerometer.requestPermissionsAsync();
  return newStatus === PermissionStatus.GRANTED;
}
```

### The `canAskAgain` flag

```ts
const response = await Accelerometer.getPermissionsAsync();

if (!response.granted && !response.canAskAgain) {
  // User has permanently denied — open device settings
  // on iOS: Linking.openURL('app-settings:')
  // on Android: Linking.openSettings()
}
```

### `PermissionStatus` enum values

```ts
PermissionStatus.GRANTED       // "granted"
PermissionStatus.DENIED        // "denied"
PermissionStatus.UNDETERMINED  // "undetermined"
```

---

## 12. Update Intervals & Performance

### Setting the interval

Every sensor supports `setUpdateInterval(ms)`:

```ts
Accelerometer.setUpdateInterval(16);   // ~60 Hz
Accelerometer.setUpdateInterval(33);   // ~30 Hz
Accelerometer.setUpdateInterval(100);  // 10 Hz
Accelerometer.setUpdateInterval(1000); // 1 Hz
```

The interval is a **hint** to the OS, not a guarantee. The actual update rate may be slightly different depending on platform and hardware.

### Choosing the right interval

| Use case | Interval | Reasoning |
|---|---|---|
| Games, AR, real-time animation | 16ms (60 Hz) | Matches screen refresh rate |
| Gesture detection | 16–33ms | Needs to catch fast motions |
| Tilt-based UI | 50–100ms | Smooth but not battery-expensive |
| Orientation detection | 100–200ms | Orientation changes slowly |
| Step counting | 100ms | Human walking cadence ~2 Hz |
| Compass | 100–200ms | Slow physical changes |
| Ambient light | 500–2000ms | Light changes very slowly |
| Battery-critical background task | 2000ms+ | Minimize wake-ups |

### Android 12+ rate limiting

Android 12 (API level 31) introduced a system-enforced cap: **without** `HIGH_SAMPLING_RATE_SENSORS` permission, the minimum interval is 5ms (200 Hz cap). Any interval shorter than 5ms will be silently clamped to 5ms.

For 99% of apps, 200 Hz is more than enough. Only specialized apps (gaming controllers, vibration analysis) need above 200 Hz.

### Battery impact

Sensors running continuously drain the battery. Guidelines:
- Always `remove()` subscriptions in `useEffect` cleanup
- Don't subscribe on app launch if the sensor isn't immediately needed
- Use longer intervals when precision matters less
- On Android, the OS batches sensor events — shorter intervals may still consume similar CPU if the device is batching

### The subscription lifecycle pattern

```tsx
import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

// CORRECT pattern
useEffect(() => {
  let sub: any = null;

  Accelerometer.isAvailableAsync().then(available => {
    if (!available) return;
    Accelerometer.setUpdateInterval(100);
    sub = Accelerometer.addListener(data => {
      // handle data
    });
  });

  // This runs when the component unmounts — stops the sensor
  return () => {
    sub?.remove();
  };
}, []);
```

---

## 13. Sensor Fusion — Combining Sensors

Each sensor has weaknesses. Combining them gives better results than any single sensor alone.

### The problem with each sensor alone

| Sensor | Strength | Weakness |
|---|---|---|
| Accelerometer | Stable long-term orientation (gravity tells you "down") | Noisy during motion; can't tell tilt from acceleration |
| Gyroscope | Fast, precise short-term rotation | Drifts over time (integration error accumulates) |
| Magnetometer | Absolute heading (North reference) | Sensitive to nearby metal/magnets; noisy |

### Complementary filter (accelerometer + gyroscope)

The complementary filter blends the two sensors: trust the gyroscope for fast changes, trust the accelerometer for the long-term average. The `ALPHA` parameter controls the blend.

```ts
import { Accelerometer, Gyroscope } from 'expo-sensors';

// ALPHA = 0.98 means: 98% gyroscope, 2% accelerometer
// Higher ALPHA = smoother, less responsive to real slow tilt changes
// Lower ALPHA = more responsive, but noisier
const ALPHA = 0.98;
const RAD_TO_DEG = 180 / Math.PI;

let angle = { x: 0, y: 0 };
let gyroData = { x: 0, y: 0, z: 0 };
let lastTimestamp: number | null = null;

Gyroscope.setUpdateInterval(16);
Accelerometer.setUpdateInterval(16);

// Store latest gyro reading
Gyroscope.addListener(data => {
  gyroData = data;
});

// Do the fusion each time accelerometer fires
Accelerometer.addListener(({ x, y, z, timestamp }) => {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
    return;
  }

  const dt = timestamp - lastTimestamp; // seconds
  lastTimestamp = timestamp;

  // --- Accelerometer contribution ---
  // When the phone is still, accelerometer gravity vector tells us exact tilt.
  // This is noisy during motion, but always correct on average.
  const accelRoll  = Math.atan2(x, Math.sqrt(y * y + z * z)); // radians
  const accelPitch = Math.atan2(y, Math.sqrt(x * x + z * z)); // radians

  // --- Gyroscope contribution ---
  // Integrate the rate to get change in angle since last update.
  // Fast and accurate short-term, but drifts without correction.
  const gyroRoll  = angle.x + gyroData.x * dt; // in radians
  const gyroPitch = angle.y + gyroData.y * dt; // in radians

  // --- Blend them ---
  // ALPHA fraction from gyro (fast, drifts)
  // (1-ALPHA) fraction from accelerometer (slow, stable)
  angle.x = ALPHA * gyroRoll  + (1 - ALPHA) * accelRoll;
  angle.y = ALPHA * gyroPitch + (1 - ALPHA) * accelPitch;

  console.log(
    `Roll: ${(angle.x * RAD_TO_DEG).toFixed(1)}°  ` +
    `Pitch: ${(angle.y * RAD_TO_DEG).toFixed(1)}°`
  );
});
```

### When to use DeviceMotion instead

If you just need orientation, `DeviceMotion` does all of this for you internally — it uses a Kalman filter or similar algorithm, which is better than a simple complementary filter. Only implement your own fusion if you need custom behavior or are doing something `DeviceMotion` doesn't support.

### Using all three sensors for full orientation + compass

```ts
import { DeviceMotion, Magnetometer } from 'expo-sensors';

let currentRotation = { alpha: 0, beta: 0, gamma: 0 };
let compassHeading = 0;

DeviceMotion.setUpdateInterval(100);
Magnetometer.setUpdateInterval(100);

// Get clean tilt from DeviceMotion (fused accelerometer + gyroscope)
DeviceMotion.addListener(({ rotation }) => {
  currentRotation = rotation;
});

// Get compass heading from Magnetometer
Magnetometer.addListener(({ x, y }) => {
  // Basic flat-phone heading — good enough if phone is roughly horizontal
  const heading = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
  compassHeading = (heading - 90 + 360) % 360;
});

// Combine: tilt-compensated compass heading
// (Full tilt compensation requires projecting the field into the horizontal plane)
function getTrueHeading(): number {
  // For a tilt-compensated compass:
  const betaRad  = currentRotation.beta  * (Math.PI / 180);
  const gammaRad = currentRotation.gamma * (Math.PI / 180);

  // This is a simplified approach — a full implementation
  // would project x/y/z of the magnetometer into the horizontal plane
  // using the tilt angles from DeviceMotion.
  return compassHeading;
}
```

---

## 14. Reusable Hooks & Patterns

### Generic sensor hook factory

```ts
import { useEffect, useRef, useState } from 'react';

// Generic hook that works with any expo-sensor
function useSensor<T>(
  sensor: {
    isAvailableAsync: () => Promise<boolean>;
    setUpdateInterval: (ms: number) => void;
    addListener: (cb: (data: T) => void) => { remove: () => void };
  },
  initialValue: T,
  intervalMs = 100,
) {
  const [data, setData] = useState<T>(initialValue);
  const [available, setAvailable] = useState<boolean | null>(null);
  const subRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    sensor.isAvailableAsync().then(ok => {
      setAvailable(ok);
      if (!ok) return;
      sensor.setUpdateInterval(intervalMs);
      subRef.current = sensor.addListener(setData);
    });

    return () => subRef.current?.remove();
  }, [intervalMs]);

  return { data, available };
}

// Usage
import { Accelerometer, Gyroscope } from 'expo-sensors';

function MyComponent() {
  const accel = useSensor(Accelerometer, { x: 0, y: 0, z: 0, timestamp: 0 }, 50);
  const gyro  = useSensor(Gyroscope,     { x: 0, y: 0, z: 0, timestamp: 0 }, 50);

  return (
    <>
      <Text>Accel X: {accel.data.x.toFixed(3)}</Text>
      <Text>Gyro Z:  {gyro.data.z.toFixed(3)}</Text>
    </>
  );
}
```

### Pause sensors when app is in background

```ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { Accelerometer } from 'expo-sensors';

function useAccelerometerWithAppState() {
  useEffect(() => {
    let sub: any = null;

    const start = () => {
      Accelerometer.setUpdateInterval(100);
      sub = Accelerometer.addListener(data => {
        // handle data
      });
    };

    const stop = () => {
      sub?.remove();
      sub = null;
    };

    start();

    const appStateListener = AppState.addEventListener('change', state => {
      if (state === 'active') start();
      else stop(); // background or inactive — stop sensor to save battery
    });

    return () => {
      stop();
      appStateListener.remove();
    };
  }, []);
}
```

### Permission check wrapper

```ts
import { Accelerometer, PermissionStatus } from 'expo-sensors';
import { Alert, Linking } from 'react-native';

async function withMotionPermission(action: () => void) {
  const { status, canAskAgain } = await Accelerometer.getPermissionsAsync();

  if (status === PermissionStatus.GRANTED) {
    action();
    return;
  }

  if (canAskAgain) {
    const { status: newStatus } = await Accelerometer.requestPermissionsAsync();
    if (newStatus === PermissionStatus.GRANTED) {
      action();
    }
    return;
  }

  // Permanently denied — must go to Settings
  Alert.alert(
    'Permission Required',
    'Motion access was denied. Please enable it in Settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
}
```

---

## 15. Full API Quick Reference

### Sensor comparison

| Sensor | Platform | Unit | Axes | What it tells you |
|---|---|---|---|---|
| Accelerometer | Android, iOS, Web | g | x, y, z | Total force (gravity + motion) |
| Gyroscope | Android, iOS, Web | rad/s | x, y, z | How fast the device is rotating |
| DeviceMotion | Android, iOS, Web | m/s², °, °/s | multiple | Clean fused orientation + motion |
| Magnetometer | Android, iOS | μT | x, y, z | Magnetic field vector |
| LightSensor | Android only | lux | — | Ambient light brightness |
| Pedometer | Android, iOS | steps | — | Step count |

### Methods every sensor shares

```ts
sensor.addListener(callback)       → EventSubscription
sensor.setUpdateInterval(ms)       → void
sensor.isAvailableAsync()          → Promise<boolean>
sensor.getPermissionsAsync()       → Promise<PermissionResponse>
sensor.requestPermissionsAsync()   → Promise<PermissionResponse>
sensor.getListenerCount()          → number
sensor.hasListeners()              → boolean
sensor.removeAllListeners()        → void   // deprecated, prefer sub.remove()

subscription.remove()              → void
```

### `PermissionResponse` type

```ts
type PermissionResponse = {
  status: 'granted' | 'denied' | 'undetermined';
  granted: boolean;         // shorthand for status === 'granted'
  canAskAgain: boolean;     // false = user permanently denied, must use Settings
  expires: 'never' | number; // all current permissions are 'never' (permanent)
};
```

### Pedometer-specific methods

```ts
Pedometer.watchStepCount(cb)                              → EventSubscription
Pedometer.getStepCountAsync(start: Date, end: Date)       → Promise<PedometerResult> // iOS only
// PedometerResult = { steps: number }
```

### DeviceMotion-specific

```ts
DeviceMotion.Gravity   // 9.80665 m/s²

// DeviceMotionOrientation enum
DeviceMotionOrientation.Portrait        // 0
DeviceMotionOrientation.RightLandscape  // 90
DeviceMotionOrientation.LeftLandscape   // -90
DeviceMotionOrientation.UpsideDown      // 180
```

### Conversion cheat sheet

```ts
// g ↔ m/s²
const ms2 = g * 9.81
const g   = ms2 / 9.81

// rad ↔ degrees
const deg = rad * (180 / Math.PI)
const rad = deg * (Math.PI / 180)

// rad/s → deg/s
const degPerSec = radPerSec * (180 / Math.PI)

// Angle from gyroscope (integration)
angle += rotationRate * dt  // dt in seconds, result in radians

// 3D magnitude
const magnitude = Math.sqrt(x*x + y*y + z*z)

// Compass heading from magnetometer (phone flat)
const heading = (Math.atan2(y, x) * 180/Math.PI - 90 + 360) % 360

// Tilt from accelerometer (phone still)
const pitch = Math.atan2(y, Math.sqrt(x*x + z*z)) * 180/Math.PI
const roll  = Math.atan2(x, Math.sqrt(y*y + z*z)) * 180/Math.PI
```

---

*Source: [Expo Sensors Documentation](https://docs.expo.dev/versions/latest/sdk/sensors/) · expo-sensors v55.0.x*
