import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/app-icon';
import { ThemedText } from '@/components/themed-text';
import { UnitSelector } from '@/components/unit-selector';
import { UI_ICONS } from '@/constants/icons';
import { Fonts, Spacing } from '@/constants/theme';
import { formatValue, getUnit, type ConverterCategory } from '@/lib/converters';
import { useTheme } from '@/hooks/use-theme';

const SYMBOL_WIDTH = 56;
const VALUE_HEIGHT = 52;

type Props = {
  category: ConverterCategory;
  fromUnit: string;
  toUnit: string;
  fromValue: string;
  toValue: string;
  onFromValueChange: (value: string) => void;
  onFromUnitChange: (unit: string) => void;
  onToUnitChange: (unit: string) => void;
  onSwap: () => void;
};

function ValueRow({
  symbol,
  value,
  accent = false,
  editable = false,
  onChangeText,
}: {
  symbol: string;
  value: string;
  accent?: boolean;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: VALUE_HEIGHT,
        gap: Spacing.two,
      }}>
      <ThemedText
        selectable
        style={{
          width: SYMBOL_WIDTH,
          textAlign: 'right',
          fontSize: 18,
          fontWeight: '600',
          color: theme.accent,
          lineHeight: VALUE_HEIGHT,
        }}>
        {symbol}
      </ThemedText>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          style={{
            flex: 1,
            fontSize: 36,
            fontWeight: '600',
            color: theme.text,
            fontFamily: Fonts.mono,
            fontVariant: ['tabular-nums'],
            padding: 0,
            margin: 0,
            lineHeight: 44,
            height: VALUE_HEIGHT,
            textAlignVertical: 'center',
          }}
        />
      ) : (
        <ThemedText
          selectable
          style={{
            flex: 1,
            fontSize: 36,
            fontWeight: '600',
            color: accent ? theme.accent : theme.text,
            fontFamily: Fonts.mono,
            fontVariant: ['tabular-nums'],
            lineHeight: 44,
            height: VALUE_HEIGHT,
            textAlignVertical: 'center',
          }}>
          {value || '0'}
        </ThemedText>
      )}
    </View>
  );
}

function ConverterCard({
  label,
  children,
  footer,
}: {
  label: 'from' | 'to';
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const theme = useTheme();
  const isResult = label === 'to';

  return (
    <View
      style={{
        backgroundColor: theme.backgroundElement,
        borderRadius: Spacing.four,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.border,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}>
      {isResult ? (
        <View
          style={{
            height: 3,
            backgroundColor: theme.accent,
          }}
        />
      ) : null}
      <View style={{ padding: Spacing.three, gap: Spacing.three }}>
        {children}
        {footer ? (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: theme.border,
              paddingTop: Spacing.two,
            }}>
            {footer}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function ConverterPanel({
  category,
  fromUnit,
  toUnit,
  fromValue,
  toValue,
  onFromValueChange,
  onFromUnitChange,
  onToUnitChange,
  onSwap,
}: Props) {
  const theme = useTheme();
  const fromSymbol = getUnit(category, fromUnit)?.symbol ?? '';
  const toSymbol = getUnit(category, toUnit)?.symbol ?? '';

  return (
    <View style={{ gap: Spacing.two, paddingHorizontal: Spacing.four }}>
      <ConverterCard label="from">
        <UnitSelector category={category} selectedUnitId={fromUnit} onSelect={onFromUnitChange} label="From" />
        <ValueRow symbol={fromSymbol} value={fromValue} editable onChangeText={onFromValueChange} />
      </ConverterCard>

      <View style={{ alignItems: 'center', marginVertical: Spacing.one }}>
        <Pressable
          onPress={onSwap}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            borderCurve: 'continuous',
            backgroundColor: theme.accentMuted,
            borderWidth: 1.5,
            borderColor: theme.accent,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}>
          <AppIcon name={UI_ICONS.swap} tintColor={theme.text} size={20} weight="semibold" />
        </Pressable>
      </View>

      <ConverterCard
        label="to"
        footer={
          fromValue && toValue ? (
            <ThemedText type="small" themeColor="textSecondary" selectable style={{ textAlign: 'center' }}>
              {fromValue} {fromSymbol} = {formatValue(parseFloat(toValue.replace(/,/g, '')) || 0, category)}{' '}
              {toSymbol}
            </ThemedText>
          ) : undefined
        }>
        <UnitSelector category={category} selectedUnitId={toUnit} onSelect={onToUnitChange} label="To" />
        <ValueRow symbol={toSymbol} value={toValue} accent />
      </ConverterCard>
    </View>
  );
}
