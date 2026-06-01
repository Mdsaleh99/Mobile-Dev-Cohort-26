# Accelerometer — Simple Tilt Demo

A beginner-friendly app to learn [Expo Accelerometer](https://docs.expo.dev/versions/v55.0.0/sdk/accelerometer/).

## Learn

Read **[NOTES.md](./NOTES.md)** for full accelerometer notes (what it is, APIs, Android tips).

## What you will see

1. Live **x, y, z** values (in g) from the sensor
2. A **blue ball** in the center that moves when you tilt (using `translateX` / `translateY`)

## Run

```bash
bun install
npx expo start
```

Open on a **real Android device** with Expo Go 55.

## Code map (start here)

| File | What it does |
|------|----------------|
| `src/hooks/use-accelerometer.ts` | Subscribes to the sensor, exposes x, y, z |
| `src/components/tilt-game.tsx` | Shows values + moves ball with `x` and `y` |

## Core idea

```ts
transform: [
  { translateX: x * MOVE },
  { translateY: y * MOVE },
]
```

Tilt changes `x` and `y` → ball moves. No targets, no collision math.
