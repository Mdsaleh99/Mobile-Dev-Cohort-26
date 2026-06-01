# DeviceMotion — Shake Detector

Detect shakes with [Expo DeviceMotion](https://docs.expo.dev/versions/v55.0.0/sdk/devicemotion/) (SDK 55).

## Run

```bash
bun install
npx expo start
```

Use a **real device** (Android or iOS) with Expo Go 55.

## Learn

Read **[NOTES.md](./NOTES.md)** for DeviceMotion theory and APIs.

## Core idea

```ts
const force = Math.hypot(acceleration.x, acceleration.y, acceleration.z);
if (force > SHAKE_THRESHOLD) {
  // count a shake
}
```

Uses `data.acceleration` (movement without gravity).
