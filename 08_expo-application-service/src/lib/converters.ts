export type ConverterCategory = 'currency' | 'temperature' | 'length' | 'weight' | 'volume' | 'speed' | 'data';

export type Unit = {
  id: string;
  label: string;
  symbol: string;
};

export type CategoryConfig = {
  id: ConverterCategory;
  label: string;
  units: Unit[];
};

export const DEFAULT_CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.54,
  CNY: 7.24,
  CHF: 0.88,
  AED: 3.67,
};

const LINEAR_FACTORS: Record<ConverterCategory, Record<string, number>> = {
  currency: DEFAULT_CURRENCY_RATES,
  temperature: { C: 0, F: 0, K: 0 },
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254, yd: 0.9144 },
  weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495, t: 1000 },
  volume: { L: 1, mL: 0.001, gal: 3.78541, floz: 0.0295735, cup: 0.236588 },
  speed: { mps: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444 },
  data: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'currency',
    label: 'Currency',
    units: [
      { id: 'USD', label: 'US Dollar', symbol: '$' },
      { id: 'EUR', label: 'Euro', symbol: '€' },
      { id: 'GBP', label: 'British Pound', symbol: '£' },
      { id: 'INR', label: 'Indian Rupee', symbol: '₹' },
      { id: 'JPY', label: 'Japanese Yen', symbol: '¥' },
      { id: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
      { id: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
      { id: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
      { id: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
      { id: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    units: [
      { id: 'C', label: 'Celsius', symbol: '°C' },
      { id: 'F', label: 'Fahrenheit', symbol: '°F' },
      { id: 'K', label: 'Kelvin', symbol: 'K' },
    ],
  },
  {
    id: 'length',
    label: 'Length',
    units: [
      { id: 'm', label: 'Meter', symbol: 'm' },
      { id: 'km', label: 'Kilometer', symbol: 'km' },
      { id: 'cm', label: 'Centimeter', symbol: 'cm' },
      { id: 'mm', label: 'Millimeter', symbol: 'mm' },
      { id: 'mi', label: 'Mile', symbol: 'mi' },
      { id: 'ft', label: 'Foot', symbol: 'ft' },
      { id: 'in', label: 'Inch', symbol: 'in' },
      { id: 'yd', label: 'Yard', symbol: 'yd' },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    units: [
      { id: 'kg', label: 'Kilogram', symbol: 'kg' },
      { id: 'g', label: 'Gram', symbol: 'g' },
      { id: 'lb', label: 'Pound', symbol: 'lb' },
      { id: 'oz', label: 'Ounce', symbol: 'oz' },
      { id: 't', label: 'Metric Ton', symbol: 't' },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    units: [
      { id: 'L', label: 'Liter', symbol: 'L' },
      { id: 'mL', label: 'Milliliter', symbol: 'mL' },
      { id: 'gal', label: 'US Gallon', symbol: 'gal' },
      { id: 'floz', label: 'Fluid Ounce', symbol: 'fl oz' },
      { id: 'cup', label: 'Cup', symbol: 'cup' },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    units: [
      { id: 'mps', label: 'Meters/sec', symbol: 'm/s' },
      { id: 'kmh', label: 'Kilometers/hr', symbol: 'km/h' },
      { id: 'mph', label: 'Miles/hr', symbol: 'mph' },
      { id: 'knot', label: 'Knot', symbol: 'kn' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    units: [
      { id: 'B', label: 'Byte', symbol: 'B' },
      { id: 'KB', label: 'Kilobyte', symbol: 'KB' },
      { id: 'MB', label: 'Megabyte', symbol: 'MB' },
      { id: 'GB', label: 'Gigabyte', symbol: 'GB' },
      { id: 'TB', label: 'Terabyte', symbol: 'TB' },
    ],
  },
];

export type ConverterPreferences = {
  category: ConverterCategory;
  fromUnit: string;
  toUnit: string;
};

export type HistoryEntry = {
  id: string;
  category: ConverterCategory;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: number;
};

export const DEFAULT_PREFERENCES: ConverterPreferences = {
  category: 'currency',
  fromUnit: 'USD',
  toUnit: 'INR',
};

function toCelsius(value: number, from: string): number {
  if (from === 'C') return value;
  if (from === 'F') return (value - 32) * (5 / 9);
  return value - 273.15;
}

function fromCelsius(value: number, to: string): number {
  if (to === 'C') return value;
  if (to === 'F') return value * (9 / 5) + 32;
  return value + 273.15;
}

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: ConverterCategory,
  currencyRates?: Record<string, number>,
): number {
  if (fromUnit === toUnit) return value;

  if (category === 'temperature') {
    return fromCelsius(toCelsius(value, fromUnit), toUnit);
  }

  const factors =
    category === 'currency'
      ? { ...DEFAULT_CURRENCY_RATES, ...currencyRates }
      : LINEAR_FACTORS[category];

  const fromFactor = factors[fromUnit];
  const toFactor = factors[toUnit];
  if (fromFactor == null || toFactor == null) return 0;

  if (category === 'currency') {
    const inUsd = value / fromFactor;
    return inUsd * toFactor;
  }

  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

export function formatValue(value: number, category: ConverterCategory): string {
  if (!Number.isFinite(value)) return '—';

  const abs = Math.abs(value);
  let decimals = 4;
  if (category === 'currency') decimals = abs >= 100 ? 2 : abs >= 1 ? 2 : 4;
  if (category === 'temperature') decimals = 1;
  if (category === 'data') decimals = abs >= 1 ? 2 : 0;

  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });

  return formatted;
}

export function getCategory(id: ConverterCategory): CategoryConfig {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function getUnit(category: ConverterCategory, unitId: string): Unit | undefined {
  return getCategory(category).units.find((u) => u.id === unitId);
}
