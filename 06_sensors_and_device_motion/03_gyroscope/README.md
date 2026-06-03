# Gyroscope — 3D Card Demo

Beginner-friendly demo for [Expo Gyroscope](https://docs.expo.dev/versions/v55.0.0/sdk/gyroscope/) (SDK 55).

## Run

```bash
bun install
npx expo start
```

Open on a **real Android device** with Expo Go 55.

## Learn

Read **[NOTES.md](./NOTES.md)** for full gyroscope notes (what it is, vs accelerometer, APIs, Android tips).

## Core idea

```ts
transform: [
  { perspective: 1000 },
  { rotateX: `${y * TILT}deg` },
  { rotateY: `${-x * TILT}deg` },
]
```

Gyro gives **rotation speed** (rad/s) → card tilts while you spin the phone.
