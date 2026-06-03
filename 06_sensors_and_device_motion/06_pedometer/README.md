# Pedometer — Step Counter

Beginner-friendly step counter using [Expo Pedometer](https://docs.expo.dev/versions/v55.0.0/sdk/pedometer/) (SDK 55).

## Run

```bash
bun install
npx expo start
```

Open on a **real Android device** with Expo Go 55. Walk with the **app in the foreground**.

## Learn

Read **[NOTES.md](./NOTES.md)** — includes **why Android sometimes shows 0 steps** and how to fix it.

## Core idea

```ts
const sub = Pedometer.watchStepCount((result) => {
  console.log(result.steps); // session steps
});
```

Permission + foreground matter more than for other sensors.
