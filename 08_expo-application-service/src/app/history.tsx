import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/app-icon';
import { ThemedText } from '@/components/themed-text';
import { UI_ICONS } from '@/constants/icons';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useConverter } from '@/hooks/use-converter';
import { useTheme } from '@/hooks/use-theme';
import { formatValue, getCategory, getUnit } from '@/lib/converters';

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { history, clearHistory } = useConverter();
  const bottomInset = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: Spacing.four,
        paddingBottom: bottomInset,
        gap: Spacing.four,
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: Spacing.four,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: Spacing.one }}>
          <ThemedText type="subtitle" style={{ fontSize: 28 }}>
            History
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Recent conversions saved locally
          </ThemedText>
        </View>
        {history.length > 0 ? (
          <Pressable
            onPress={clearHistory}
            style={({ pressed }) => ({
              paddingHorizontal: Spacing.three,
              paddingVertical: Spacing.two,
              borderRadius: Spacing.three,
              borderCurve: 'continuous',
              backgroundColor: theme.backgroundElement,
              borderWidth: 1,
              borderColor: theme.border,
              opacity: pressed ? 0.8 : 1,
            })}>
            <ThemedText type="small" themeColor="textSecondary">
              Clear
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      {history.length === 0 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.six,
            gap: Spacing.three,
            backgroundColor: theme.backgroundElement,
            borderRadius: Spacing.four,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: theme.border,
          }}>
          <AppIcon name={UI_ICONS.emptyHistory} tintColor={theme.textSecondary} size={32} />
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
            No conversions yet.{'\n'}Start converting on the Convert tab.
          </ThemedText>
        </View>
      ) : (
        <View style={{ gap: Spacing.two }}>
          {history.map((entry) => {
            const categoryLabel = getCategory(entry.category).label;
            const fromSymbol = getUnit(entry.category, entry.fromUnit)?.symbol ?? entry.fromUnit;
            const toSymbol = getUnit(entry.category, entry.toUnit)?.symbol ?? entry.toUnit;

            return (
              <View
                key={entry.id}
                style={{
                  backgroundColor: theme.backgroundElement,
                  borderRadius: Spacing.three,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: theme.border,
                  padding: Spacing.three,
                  gap: Spacing.two,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ThemedText type="smallBold" themeColor="accent">
                    {categoryLabel}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatTime(entry.timestamp)}
                  </ThemedText>
                </View>
                <ThemedText selectable style={{ fontVariant: ['tabular-nums'] }}>
                  {formatValue(entry.fromValue, entry.category)} {fromSymbol} →{' '}
                  <ThemedText style={{ color: theme.accent, fontWeight: '600' }}>
                    {formatValue(entry.toValue, entry.category)} {toSymbol}
                  </ThemedText>
                </ThemedText>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
