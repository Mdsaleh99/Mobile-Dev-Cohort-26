import { useEffect, useRef, useState } from "react";
import { DeviceMotion } from "expo-sensors";

/** Minimum total acceleration (m/s²) to count as a shake */
export const SHAKE_THRESHOLD = 14;

/** Wait between shake events (ms) */
export const COOLDOWN_MS = 800;

export function useShakeDetection() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [force, setForce] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const lastShakeTime = useRef(0);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    void (async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;

      await DeviceMotion.requestPermissionsAsync();
      DeviceMotion.setUpdateInterval(100);

      subscription = DeviceMotion.addListener(({ acceleration }) => {
        if (!acceleration) return;

        const totalForce = Math.hypot(
          acceleration.x,
          acceleration.y,
          acceleration.z,
        );
        setForce(totalForce);

        const now = Date.now();
        if (
          totalForce > SHAKE_THRESHOLD &&
          now - lastShakeTime.current > COOLDOWN_MS
        ) {
          lastShakeTime.current = now;
          setShakeCount((count) => count + 1);
        }
      });
    })();

    return () => subscription?.remove();
  }, []);

  const isShaking = force > SHAKE_THRESHOLD;

  return { available, force, isShaking, shakeCount };
}
