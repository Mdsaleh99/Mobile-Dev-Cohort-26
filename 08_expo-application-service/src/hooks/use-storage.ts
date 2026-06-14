import { useCallback, useSyncExternalStore } from 'react';

import { storage } from '@/lib/storage';

export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    (cb) => storage.subscribe(key, cb),
    () => storage.get(key, defaultValue),
    () => storage.get(key, defaultValue),
  );

  const setValue = useCallback((newValue: T) => storage.set(key, newValue), [key]);

  return [value, setValue];
}
