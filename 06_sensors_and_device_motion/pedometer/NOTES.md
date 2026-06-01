# Pedometer — Learning Notes (Expo SDK 55, Android, Expo Go)

Docs: [Pedometer](https://docs.expo.dev/versions/v55.0.0/sdk/pedometer/) · [Sensors](https://docs.expo.dev/versions/v55.0.0/sdk/sensors/)

---

## What is the pedometer?

The **pedometer** counts **steps** using the phone’s motion hardware.

In Expo you mainly use:

| API | What you get |
|-----|----------------|
| `Pedometer.watchStepCount(callback)` | Live step updates while subscribed |
| `Pedometer.getStepCountAsync(start, end)` | Steps between two dates (**iOS only**) |

Each update gives:

```ts
{ steps: number }
```

For `watchStepCount`, **`steps` are steps since you started watching** in that session (not always “today” on every device). Our demo shows **“Steps (this session)”** so that is clear.

---

## Why does it exist?

- Fitness apps and daily step goals
- Health tracking (with user consent)
- Gamification (“walk 10,000 steps”)
- Rough activity level for apps

---

## iOS vs Android (why iOS works in Expo Go but Android often does not)

| | iOS | Android |
|---|-----|---------|
| API | Core Motion | `Sensor.TYPE_STEP_COUNTER` |
| Expo Go | Usually works after motion access | Needs **Physical activity** on **Expo Go** |
| Permission | Simpler | `ACTIVITY_RECOGNITION` (Android 10+) |
| Background steps | Limited | **Not supported** with `watchStepCount` |
| History | `getStepCountAsync` ✅ | ❌ not available |

**Same React code** — the platform behavior is different, not a bug in your component.

---

## vs other sensors

| Sensor | Measures |
|--------|----------|
| Accelerometer | Tilt / acceleration (g) |
| Gyroscope | Rotation speed (rad/s) |
| Magnetometer | Magnetic field (μT) |
| Light sensor | Brightness (lux) |
| **Pedometer** | **Step count** |

The OS fuses accelerometer + other signals internally — you usually **don’t** read raw axes for steps.

---

## Real-world examples

1. **Google Fit / Samsung Health** — daily steps
2. **Apple Health** — step history (iOS uses Core Motion)
3. **Fitness challenges** in apps
4. **“Walk to unlock”** game mechanics

---

## How to use with Expo (Android + Expo Go 55)

### Install

```bash
npx expo install expo-sensors
```

### Import

```ts
import { Pedometer } from "expo-sensors";
```

### Recommended flow (what our app does)

```ts
// 1) Is there a step sensor?
const available = await Pedometer.isAvailableAsync();

// 2) Permission (important on Android!)
const permission = await Pedometer.requestPermissionsAsync();
if (!permission.granted) return;

// 3) Subscribe
const subscription = Pedometer.watchStepCount((result) => {
  console.log(result.steps);
});

// 4) Cleanup
subscription.remove();
```

### Android permission: `ACTIVITY_RECOGNITION`

From Android 10 (API 29), apps need **physical activity / activity recognition** permission to use step counters.

In **your own built app**, add to `app.json`:

```json
"android": {
  "permissions": ["android.permission.ACTIVITY_RECOGNITION"]
}
```

(This project includes that for when you make a **development build** or production APK.)

### `setUpdateInterval`?

Unlike Accelerometer/Gyroscope, **Pedometer has no `setUpdateInterval`** — the OS decides when to deliver step batches.

---

## Mostly used APIs

| API | Android | iOS | Purpose |
|-----|---------|-----|---------|
| `isAvailableAsync()` | ✅ | ✅ | Hardware / API available? |
| `watchStepCount(cb)` | ✅ | ✅ | Live step updates |
| `getStepCountAsync(start, end)` | ❌ | ✅ | Historical range |
| `getPermissionsAsync()` | ✅ | ✅ | Check permission |
| `requestPermissionsAsync()` | ✅ | ✅ | Ask permission |

### Types

**`PedometerResult`**

| Field | Type | Meaning |
|-------|------|---------|
| `steps` | `number` | Step count for that callback / range |

**`PermissionStatus`:** `GRANTED` · `DENIED` · `UNDETERMINED`

---

## Critical Expo docs limitation (background)

From the official docs:

> **Pedometer updates will not be delivered while the app is in the background.**

So if you:

- Switch to another app
- Turn the screen off for a long time
- Minimize Expo Go

…you **will not** get new steps until the app is **foreground** again. This is a very common “it stopped working” report — it’s expected with this API.

For all-day counting in production, teams use **Health Connect** (Android) or platform health APIs — not only `watchStepCount`.

---

## Why pedometer “sometimes doesn’t work” on Android (in-depth)

This section is for your **intermittent Android** issues.

### 1. Permission says granted but isn’t really (Expo Go)

On many Android 10+ devices, step counting needs:

`android.permission.ACTIVITY_RECOGNITION`

Known issues on Expo GitHub:

- `Pedometer.getPermissionsAsync()` often returns **`denied` in Expo Go even after you allow the permission in Settings**
- Our app now uses **`PermissionsAndroid.check()`** as the real status (label: **Permission (Android)** on screen)
- **Expo API says** row is only for debugging — ignore it if Android says Granted
- Fix: **Settings → Apps → Expo Go → Permissions → Physical activity** (or **Body sensors**) → **Allow**
- If you tapped **Don’t ask again**, the popup will never return — Settings is the only fix

References: [expo#16605](https://github.com/expo/expo/issues/16605), [expo#13131](https://github.com/expo/expo/issues/13131)

### 2. App not in foreground

`watchStepCount` only fires while your JS session is active and the app is foreground. Walk **with the app open** on screen to test.

### 3. Device / OEM differences

Samsung, Xiaomi, Huawei, etc. may:

- Delay step reporting
- Aggressive battery optimization killing sensors
- Require extra “Samsung Health” style permissions outside Expo

Try: disable battery optimization for Expo Go while testing.

### 4. `isAvailableAsync()` is true but callback never fires

Happens on some models (e.g. certain Samsung Android 11). Usually permission or OEM restriction — not your React code.

### 5. Emulator

Android emulator **often does not simulate walking**. Always test on a **real phone** and **actually walk** 10–20 steps.

### 6. Expect instant updates

Some devices batch steps every few seconds or only after a minimum movement. Wait a few seconds after walking.

### 7. iOS vs Android feature gap

`getStepCountAsync` (last 24 hours, etc.) is **iOS only**. On Android, this demo only uses `watchStepCount` for the current session.

### 8. Development build vs Expo Go

For reliable permission prompts on Android, a **custom dev client / EAS build** with `ACTIVITY_RECOGNITION` in the manifest often works better than Expo Go alone.

---

## Troubleshooting checklist (use this on your phone)

| Step | Action |
|------|--------|
| 1 | Real device, not emulator |
| 2 | Expo Go updated, SDK 55 project |
| 3 | Open **this** step counter screen |
| 4 | Tap **Allow activity / steps** |
| 5 | If no popup: **Settings → Expo Go → Permissions → Physical activity → Allow** |
| 6 | Status shows **Listening: Yes**, **Permission: Granted** |
| 7 | Keep app **on screen**, walk 20 steps, wait 5–10 s |
| 8 | Don’t lock phone or switch apps while testing |
| 9 | If still 0: try outdoors walk, disable battery saver for Expo Go |
| 10 | For production: use EAS build with `ACTIVITY_RECOGNITION` in `app.json` |

---

## This project’s core idea

```ts
Pedometer.watchStepCount((result) => {
  setSteps(result.steps); // steps since watch started
});
```

UI also shows:

- Available?
- Permission granted?
- Listening?
- Foreground? (warns when background pauses updates)

---

## Code map

| File | Role |
|------|------|
| `src/hooks/use-pedometer.ts` | Permission + `watchStepCount` |
| `src/components/step-counter.tsx` | UI + Android tips |
| `src/app/index.tsx` | Home screen |
| `app.json` | `ACTIVITY_RECOGNITION` for custom builds |

---

## What to try on your Android phone

1. Open the app → read status rows  
2. Grant physical activity permission (Settings if needed)  
3. Confirm **Listening: Yes**  
4. Walk with the phone while watching the screen  
5. Session steps should increase  

When you build your **own** APK with EAS, permission behavior is usually more predictable than Expo Go alone.
