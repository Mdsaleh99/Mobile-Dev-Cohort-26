import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import type { PlatformIcon } from '@/constants/icons';

type Props = {
  name: PlatformIcon;
  tintColor: string;
  size?: number;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  style?: StyleProp<ViewStyle>;
};

export function AppIcon({ name, tintColor, size = 20, weight = 'medium', style }: Props) {
  return (
    <SymbolView
      name={name as SymbolViewProps['name']}
      tintColor={tintColor}
      size={size}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={style}
    />
  );
}
