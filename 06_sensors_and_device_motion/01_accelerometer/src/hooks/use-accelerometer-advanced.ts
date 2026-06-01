import { useEffect, useState, useRef } from "react";
import { Accelerometer } from "expo-sensors";
import { smoothValue } from "@/utils/physics";
import { MovingAverageFilter, SensorStats, getSensorStats } from "@/utils/sensors";

interface UseAccelerometerAdvancedOptions {
  smoothing?: number;
  updateInterval?: number;
  movingAverageWindow?: number;
}

export function useAccelerometerAdvanced(
  options: UseAccelerometerAdvancedOptions = {}
) {
  const {
    smoothing = 0.3,
    updateInterval = 50,
    movingAverageWindow = 5,
  } = options;

  const [available, setAvailable] = useState<boolean | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [stats, setStats] = useState<SensorStats>({
    magnitude: 0,
    angle: 0,
    intensity: 0,
  });

  const smoothedX = useRef(0);
  const smoothedY = useRef(0);
  const smoothedZ = useRef(0);
  const filterX = useRef(new MovingAverageFilter(movingAverageWindow));
  const filterY = useRef(new MovingAverageFilter(movingAverageWindow));
  const filterZ = useRef(new MovingAverageFilter(movingAverageWindow));

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    (async () => {
      const isAvailable = await Accelerometer.isAvailableAsync();
      setAvailable(isAvailable);

      if (!isAvailable) return;

      Accelerometer.setUpdateInterval(updateInterval);

      subscription = Accelerometer.addListener((data) => {
        // Apply moving average filter
        const filteredX = filterX.current.filter(data.x);
        const filteredY = filterY.current.filter(data.y);
        const filteredZ = filterZ.current.filter(data.z);

        // Apply exponential smoothing
        smoothedX.current = smoothValue(filteredX, smoothedX.current, smoothing);
        smoothedY.current = smoothValue(filteredY, smoothedY.current, smoothing);
        smoothedZ.current = smoothValue(filteredZ, smoothedZ.current, smoothing);

        setX(smoothedX.current);
        setY(smoothedY.current);
        setZ(smoothedZ.current);

        // Calculate stats
        setStats(
          getSensorStats({
            x: smoothedX.current,
            y: smoothedY.current,
            z: smoothedZ.current,
          })
        );
      });
    })();

    return () => {
      subscription?.remove();
      filterX.current.reset();
      filterY.current.reset();
      filterZ.current.reset();
    };
  }, [smoothing, updateInterval, movingAverageWindow]);

  return { available, x, y, z, stats };
}
