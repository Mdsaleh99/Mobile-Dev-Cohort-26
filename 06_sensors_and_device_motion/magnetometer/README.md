# Compass (Magnetometer)

Beginner-friendly compass for [Expo Magnetometer](https://docs.expo.dev/versions/v55.0.0/sdk/magnetometer/) (SDK 55).

## Run

```bash
bun install
npx expo start
```

Open on a **real Android device** with Expo Go 55. Hold the phone flat when using the compass.

## Learn

Read **[NOTES.md](./NOTES.md)** for full magnetometer notes.

## Core idea

```ts
heading = atan2(-x, -y) // Android, converted to 0–360°
transform: [{ rotate: `${-heading}deg` }] // needle
```

Show **x, y, z** (μT) + rotate needle from **heading**.
