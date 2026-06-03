import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, PermissionsAndroid, Platform } from "react-native";
import { PermissionStatus, type PermissionResponse } from "expo-modules-core";
import { Pedometer } from "expo-sensors";

type PedometerResult = { steps: number };

const isAndroid = Platform.OS === "android";

function needsActivityPermission() {
  return isAndroid && Number(Platform.Version) >= 29;
}

async function readActivityPermission(): Promise<PermissionResponse> {
  if (!needsActivityPermission()) {
    return Pedometer.getPermissionsAsync();
  }

  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
  );

  return {
    granted,
    status: granted ? PermissionStatus.GRANTED : PermissionStatus.DENIED,
    canAskAgain: true,
    expires: "never",
  };
}

async function requestActivityPermission(): Promise<PermissionResponse> {
  if (!needsActivityPermission()) {
    return Pedometer.requestPermissionsAsync();
  }

  const current = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
  );
  if (current) {
    return readActivityPermission();
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    {
      title: "Physical activity",
      message: "Allow Expo Go to count steps for this demo.",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    },
  );

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
      expires: "never",
    };
  }

  return readActivityPermission();
}

export function usePedometer() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [expoPermission, setExpoPermission] = useState<PermissionResponse | null>(
    null,
  );
  const [steps, setSteps] = useState(0);
  const [isForeground, setIsForeground] = useState(true);
  const [listening, setListening] = useState(false);
  const [listenError, setListenError] = useState<string | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);

  const stopListening = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    stopListening();
    setListenError(null);

    try {
      subscriptionRef.current = Pedometer.watchStepCount(
        (result: PedometerResult) => {
          setSteps(result.steps);
          setListenError(null);
        },
      );
      setListening(true);
    } catch (error) {
      setListenError(
        error instanceof Error ? error.message : "Could not start step listener",
      );
      setListening(false);
    }
  }, [stopListening]);

  const refreshPermission = useCallback(async () => {
    const androidPerm = await readActivityPermission();
    const expoPerm = await Pedometer.getPermissionsAsync();
    setPermission(androidPerm);
    setExpoPermission(expoPerm);
    return androidPerm;
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestActivityPermission();
    setPermission(result);
    const expoPerm = await Pedometer.getPermissionsAsync();
    setExpoPermission(expoPerm);
    return result;
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      const active = state === "active";
      setIsForeground(active);
      if (active) {
        void refreshPermission();
        if (available) {
          startListening();
        }
      } else if (isAndroid) {
        stopListening();
      }
    });
    return () => sub.remove();
  }, [available, refreshPermission, startListening, stopListening]);

  useEffect(() => {
    void (async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setAvailable(isAvailable);

      if (isAndroid) {
        await requestPermission();
      } else {
        await Pedometer.requestPermissionsAsync();
      }
      await refreshPermission();
    })();
  }, [refreshPermission, requestPermission]);

  useEffect(() => {
    if (!available) {
      stopListening();
      return;
    }

    // iOS: Expo Go usually works once motion permission is granted
    if (!isAndroid && !permission?.granted) {
      stopListening();
      setSteps(0);
      return;
    }

    // Android: always try — permission UI may say denied while sensor still works
    startListening();
    return () => stopListening();
  }, [available, permission?.granted, startListening, stopListening]);

  return {
    available,
    permission,
    expoPermission,
    steps,
    isForeground,
    listening,
    listenError,
    requestPermission,
    refreshPermission,
    startListening,
    isAndroid,
    androidApi: isAndroid ? Number(Platform.Version) : null,
  };
}
