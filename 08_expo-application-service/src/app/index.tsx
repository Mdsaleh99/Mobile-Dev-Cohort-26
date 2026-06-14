import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTabs } from '@/components/category-tabs';
import { ConverterPanel } from '@/components/converter-panel';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useConverter } from '@/hooks/use-converter';
import { useTheme } from '@/hooks/use-theme';

export default function ConvertScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const converter = useConverter();
  const [fromValue, setFromValue] = useState('1');
  const toValue = converter.computeResult(fromValue);

  const handleFromChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.,-]/g, '');
      setFromValue(sanitized);
    },
    [],
  );

  const handleSwap = useCallback(() => {
    converter.swapUnits();
    setFromValue(toValue.replace(/,/g, '') || '1');
  }, [converter, toValue]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (fromValue && toValue) converter.saveToHistory(fromValue, toValue);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [fromValue, toValue, converter.preferences.fromUnit, converter.preferences.toUnit, converter.category]);

  const bottomInset = insets.bottom + BottomTabInset + Spacing.three;

  

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: Spacing.three + insets.top,
        paddingBottom: bottomInset,
        gap: Spacing.three,
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        width: '100%',
      }}
      keyboardShouldPersistTaps="handled">
      <View style={{ gap: Spacing.two, paddingHorizontal: Spacing.four }}>
        <ThemedText type="subtitle" style={{ fontSize: 28 }}>
          Convert
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Offline conversions — rates stored on your device
        </ThemedText>
      </View>

      <CategoryTabs selected={converter.category} onSelect={converter.setCategory} />

      <ConverterPanel
        category={converter.category}
        fromUnit={converter.preferences.fromUnit}
        toUnit={converter.preferences.toUnit}
        fromValue={fromValue}
        toValue={toValue}
        onFromValueChange={handleFromChange}
        onFromUnitChange={converter.setFromUnit}
        onToUnitChange={converter.setToUnit}
        onSwap={handleSwap}
      />

      {Platform.OS !== 'web' ? (
        <View style={{ paddingHorizontal: Spacing.four }}>
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
            All data stays local — no network required
          </ThemedText>
        </View>
      ) : null}
    </ScrollView>
  );
}
