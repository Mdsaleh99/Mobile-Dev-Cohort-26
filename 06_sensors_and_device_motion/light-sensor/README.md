# Light Sensor — Brightness Meter

Beginner-friendly demo for [Expo LightSensor](https://docs.expo.dev/versions/v55.0.0/sdk/light-sensor/) (SDK 55).

**Android only** in Expo.

## Run

```bash
bun install
npx expo start
```

Open on a **real Android device** with Expo Go 55.

## Learn

Read **[NOTES.md](./NOTES.md)** for full light sensor notes.

## Core idea

```ts
LightSensor.addListener(({ illuminance }) => {
  // illuminance in lux (lx)
});

barWidth = (lux / MAX_LUX_FOR_BAR) * 100;
```

More light → higher lux → wider bar.
