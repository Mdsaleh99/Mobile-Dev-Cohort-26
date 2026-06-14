import type { ConverterCategory } from '@/lib/converters';

export type PlatformIcon = {
  ios: string;
  android: string;
  web: string;
};

export const CATEGORY_ICONS: Record<ConverterCategory, PlatformIcon> = {
  currency: { ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' },
  temperature: { ios: 'thermometer.medium', android: 'device_thermostat', web: 'device_thermostat' },
  length: { ios: 'ruler.fill', android: 'straighten', web: 'straighten' },
  weight: { ios: 'scalemass.fill', android: 'scale', web: 'scale' },
  volume: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' },
  speed: { ios: 'gauge.with.needle.fill', android: 'speed', web: 'speed' },
  data: { ios: 'externaldrive.fill', android: 'sd_storage', web: 'storage' },
};

export const TAB_ICONS = {
  convert: { ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
} as const;

export const UI_ICONS = {
  swap: { ios: 'arrow.up.arrow.down', android: 'swap_vert', web: 'swap_vert' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  emptyHistory: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  update: { ios: 'arrow.down.circle.fill', android: 'system_update', web: 'system_update' },
} as const;
