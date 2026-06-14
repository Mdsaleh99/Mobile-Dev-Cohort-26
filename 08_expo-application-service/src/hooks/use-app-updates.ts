import * as Updates from 'expo-updates';
import { useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useAppUpdates() {
  const {
    isUpdateAvailable,
    isUpdatePending,
    isDownloading,
    isChecking,
    downloadProgress,
    checkError,
    downloadError,
  } = Updates.useUpdates();

  const checkForUpdate = useCallback(async () => {
    if (!Updates.isEnabled) return;

    try {
      await Updates.checkForUpdateAsync();
    } catch {
      // Unavailable in development or when updates are disabled.
    }
  }, []);

  useEffect(() => {
    if (!Updates.isEnabled) return;
    void checkForUpdate();
  }, [checkForUpdate]);

  useEffect(() => {
    if (!Updates.isEnabled) return;

    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void checkForUpdate();
      }
    });

    return () => subscription.remove();
  }, [checkForUpdate]);

  const downloadUpdate = useCallback(async () => {
    if (!Updates.isEnabled) return;

    try {
      await Updates.fetchUpdateAsync();
    } catch {
      // Errors surface through downloadError from useUpdates().
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (!Updates.isEnabled) return;

    await Updates.reloadAsync({
      reloadScreenOptions: {
        backgroundColor: '#09090b',
        fade: true,
        spinner: { enabled: true, color: '#a3e635', size: 'medium' },
      },
    });
  }, []);

  return {
    isEnabled: Updates.isEnabled,
    isUpdateAvailable,
    isUpdatePending,
    isDownloading,
    isChecking,
    downloadProgress,
    checkError,
    downloadError,
    checkForUpdate,
    downloadUpdate,
    applyUpdate,
  };
}
