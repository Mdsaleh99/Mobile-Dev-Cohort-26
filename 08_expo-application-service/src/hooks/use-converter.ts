import { useCallback, useMemo } from 'react';

import { useStorage } from '@/hooks/use-storage';
import {
  convert,
  DEFAULT_PREFERENCES,
  formatValue,
  getCategory,
  type ConverterCategory,
  type ConverterPreferences,
  type HistoryEntry,
} from '@/lib/converters';

const PREFERENCES_KEY = 'converter:preferences';
const HISTORY_KEY = 'converter:history';
const RATES_KEY = 'converter:currency-rates';

const MAX_HISTORY = 50;

export function useConverter() {
  const [preferences, setPreferences] = useStorage<ConverterPreferences>(
    PREFERENCES_KEY,
    DEFAULT_PREFERENCES,
  );
  const [history, setHistory] = useStorage<HistoryEntry[]>(HISTORY_KEY, []);
  const [currencyRates, setCurrencyRates] = useStorage<Record<string, number>>(RATES_KEY, {});

  const category = preferences.category;
  const categoryConfig = getCategory(category);

  const setCategory = useCallback(
    (newCategory: ConverterCategory) => {
      const units = getCategory(newCategory).units;
      setPreferences({
        category: newCategory,
        fromUnit: units[0].id,
        toUnit: units[1]?.id ?? units[0].id,
      });
    },
    [setPreferences],
  );

  const setFromUnit = useCallback(
    (fromUnit: string) => setPreferences({ ...preferences, fromUnit }),
    [preferences, setPreferences],
  );

  const setToUnit = useCallback(
    (toUnit: string) => setPreferences({ ...preferences, toUnit }),
    [preferences, setPreferences],
  );

  const swapUnits = useCallback(
    () =>
      setPreferences({
        ...preferences,
        fromUnit: preferences.toUnit,
        toUnit: preferences.fromUnit,
      }),
    [preferences, setPreferences],
  );

  const computeResult = useCallback(
    (input: string) => {
      const parsed = parseFloat(input.replace(/,/g, ''));
      if (!input || Number.isNaN(parsed)) return '';
      const result = convert(parsed, preferences.fromUnit, preferences.toUnit, category, currencyRates);
      return formatValue(result, category);
    },
    [preferences.fromUnit, preferences.toUnit, category, currencyRates],
  );

  const saveToHistory = useCallback(
    (fromValue: string, toValue: string) => {
      const parsed = parseFloat(fromValue.replace(/,/g, ''));
      const result = parseFloat(toValue.replace(/,/g, ''));
      if (!fromValue || Number.isNaN(parsed) || Number.isNaN(result)) return;

      const last = history[0];
      if (
        last &&
        last.category === category &&
        last.fromUnit === preferences.fromUnit &&
        last.toUnit === preferences.toUnit &&
        last.fromValue === parsed &&
        last.toValue === result
      ) {
        return;
      }

      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        category,
        fromUnit: preferences.fromUnit,
        toUnit: preferences.toUnit,
        fromValue: parsed,
        toValue: result,
        timestamp: Date.now(),
      };

      setHistory([entry, ...history].slice(0, MAX_HISTORY));
    },
    [category, preferences.fromUnit, preferences.toUnit, history, setHistory],
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const updateCurrencyRate = useCallback(
    (currency: string, rate: number) => {
      setCurrencyRates({ ...currencyRates, [currency]: rate });
    },
    [currencyRates, setCurrencyRates],
  );

  return useMemo(
    () => ({
      preferences,
      category,
      categoryConfig,
      history,
      currencyRates,
      setCategory,
      setFromUnit,
      setToUnit,
      swapUnits,
      computeResult,
      saveToHistory,
      clearHistory,
      updateCurrencyRate,
    }),
    [
      preferences,
      category,
      categoryConfig,
      history,
      currencyRates,
      setCategory,
      setFromUnit,
      setToUnit,
      swapUnits,
      computeResult,
      saveToHistory,
      clearHistory,
      updateCurrencyRate,
    ],
  );
}
