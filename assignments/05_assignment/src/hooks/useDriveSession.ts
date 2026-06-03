import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accelerometer,
  DeviceMotion,
  Gyroscope,
  Magnetometer,
  type AccelerometerMeasurement,
  type DeviceMotionMeasurement,
  type GyroscopeMeasurement,
  type MagnetometerMeasurement,
} from "expo-sensors";

import { EVENT_RULES, SENSOR_UPDATE_INTERVAL_MS } from "@/lib/driveRules";
import {
  convertDegreesToRadiansPerSecond,
  detectDriveEvents,
} from "@/lib/eventDetection";
import {
  calculateDriveScore,
  getEventBreakdown,
  getSafetyRating,
} from "@/lib/scoring";
import {
  DriveEvent,
  DriveEventType,
  SensorAvailability,
  SensorSnapshot,
  Vector3,
} from "@/types/drive";

type SensorSubscription = {
  remove: () => void;
};

const INITIAL_SENSOR_AVAILABILITY: SensorAvailability = {
  Accelerometer: null,
  Gyroscope: null,
  "Device Motion": null,
  Magnetometer: null,
};

const INITIAL_SENSOR_SNAPSHOT: SensorSnapshot = {
  acceleration: null,
  gyroscope: null,
  deviceMotion: null,
  magnetometer: null,
};

function toVector3(reading: AccelerometerMeasurement | GyroscopeMeasurement | MagnetometerMeasurement): Vector3 {
  return {
    x: reading.x,
    y: reading.y,
    z: reading.z,
  };
}

function toDeviceRotationRate(reading: DeviceMotionMeasurement): Vector3 | null {
  if (!reading.rotationRate) {
    return null;
  }

  return convertDegreesToRadiansPerSecond({
    x: reading.rotationRate.alpha,
    y: reading.rotationRate.beta,
    z: reading.rotationRate.gamma,
  });
}

export function useDriveSession() {
  const [isDriving, setIsDriving] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [events, setEvents] = useState<DriveEvent[]>([]);
  const [sensorAvailability, setSensorAvailability] = useState<SensorAvailability>(
    INITIAL_SENSOR_AVAILABILITY,
  );
  const [sensorSnapshot, setSensorSnapshot] = useState<SensorSnapshot>(
    INITIAL_SENSOR_SNAPSHOT,
  );

  const subscriptionsRef = useRef<SensorSubscription[]>([]);
  const accelerationRef = useRef<Vector3 | null>(null);
  const gyroscopeRef = useRef<Vector3 | null>(null);
  const deviceRotationRef = useRef<Vector3 | null>(null);
  const lastEventTimesRef = useRef<Partial<Record<DriveEventType, number>>>({});

  const score = useMemo(() => calculateDriveScore(events), [events]);
  const rating = useMemo(() => getSafetyRating(score), [score]);
  const eventBreakdown = useMemo(() => getEventBreakdown(events), [events]);

  const clearSubscriptions = useCallback(() => {
    subscriptionsRef.current.forEach((subscription) => subscription.remove());
    subscriptionsRef.current = [];
  }, []);

  const checkForEvents = useCallback(() => {
    const now = Date.now();
    const detectedEvents = detectDriveEvents({
      acceleration: accelerationRef.current,
      gyroscope: gyroscopeRef.current,
      deviceRotationRate: deviceRotationRef.current,
      lastEventTimes: lastEventTimesRef.current,
      now,
    });

    if (detectedEvents.length === 0) {
      return;
    }

    detectedEvents.forEach((event) => {
      lastEventTimesRef.current[event.type] = now;
    });
    setEvents((currentEvents) => [...detectedEvents, ...currentEvents]);
  }, []);

  const startDrive = useCallback(async () => {
    clearSubscriptions();

    const availability: SensorAvailability = {
      Accelerometer: await Accelerometer.isAvailableAsync(),
      Gyroscope: await Gyroscope.isAvailableAsync(),
      "Device Motion": await DeviceMotion.isAvailableAsync(),
      Magnetometer: await Magnetometer.isAvailableAsync(),
    };

    Accelerometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);
    Gyroscope.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);
    DeviceMotion.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);
    Magnetometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);

    setSensorAvailability(availability);
    setEvents([]);
    setElapsedSeconds(0);
    setEndedAt(null);
    setStartedAt(Date.now());
    setSensorSnapshot(INITIAL_SENSOR_SNAPSHOT);
    lastEventTimesRef.current = {};
    accelerationRef.current = null;
    gyroscopeRef.current = null;
    deviceRotationRef.current = null;

    if (availability.Accelerometer) {
      subscriptionsRef.current.push(
        Accelerometer.addListener((reading) => {
          const acceleration = toVector3(reading);
          accelerationRef.current = acceleration;
          setSensorSnapshot((snapshot) => ({ ...snapshot, acceleration }));
          checkForEvents();
        }),
      );
    }

    if (availability.Gyroscope) {
      subscriptionsRef.current.push(
        Gyroscope.addListener((reading) => {
          const gyroscope = toVector3(reading);
          gyroscopeRef.current = gyroscope;
          setSensorSnapshot((snapshot) => ({ ...snapshot, gyroscope }));
          checkForEvents();
        }),
      );
    }

    if (availability["Device Motion"]) {
      subscriptionsRef.current.push(
        DeviceMotion.addListener((reading) => {
          const deviceMotion = reading.acceleration
            ? {
                x: reading.acceleration.x,
                y: reading.acceleration.y,
                z: reading.acceleration.z,
              }
            : null;
          deviceRotationRef.current = toDeviceRotationRate(reading);
          setSensorSnapshot((snapshot) => ({ ...snapshot, deviceMotion }));
          checkForEvents();
        }),
      );
    }

    if (availability.Magnetometer) {
      subscriptionsRef.current.push(
        Magnetometer.addListener((reading) => {
          const magnetometer = toVector3(reading);
          setSensorSnapshot((snapshot) => ({ ...snapshot, magnetometer }));
        }),
      );
    }

    setIsDriving(true);
  }, [checkForEvents, clearSubscriptions]);

  const endDrive = useCallback(() => {
    clearSubscriptions();
    setIsDriving(false);
    const finishedAt = Date.now();
    setEndedAt(finishedAt);

    if (startedAt) {
      setElapsedSeconds(Math.floor((finishedAt - startedAt) / 1000));
    }
  }, [clearSubscriptions, startedAt]);

  useEffect(() => {
    if (!isDriving || !startedAt) {
      return undefined;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isDriving, startedAt]);

  useEffect(() => clearSubscriptions, [clearSubscriptions]);

  return {
    isDriving,
    startedAt,
    endedAt,
    elapsedSeconds,
    events,
    score,
    rating,
    eventBreakdown,
    sensorAvailability,
    sensorSnapshot,
    eventRules: EVENT_RULES,
    startDrive,
    endDrive,
  };
}
