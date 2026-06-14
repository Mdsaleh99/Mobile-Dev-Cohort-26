import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { AppIcon } from '@/components/app-icon';
import { ThemedText } from '@/components/themed-text';
import { UI_ICONS } from '@/constants/icons';
import { Spacing } from '@/constants/theme';
import { getCategory, type ConverterCategory, type Unit } from '@/lib/converters';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  category: ConverterCategory;
  selectedUnitId: string;
  onSelect: (unitId: string) => void;
  label: string;
};

export function UnitSelector({ category, selectedUnitId, onSelect, label }: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const units = getCategory(category).units;
  const selected = units.find((u) => u.id === selectedUnitId) ?? units[0];

  function handleSelect(unit: Unit) {
    onSelect(unit.id);
    setOpen(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 56,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
          borderRadius: Spacing.three,
          borderCurve: 'continuous',
          backgroundColor: theme.backgroundSelected,
          borderWidth: 1,
          borderColor: theme.border,
          opacity: pressed ? 0.85 : 1,
        })}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
          <ThemedText type="small" themeColor="textSecondary" style={{ lineHeight: 16 }}>
            {label}
          </ThemedText>
          <ThemedText type="smallBold" selectable style={{ lineHeight: 20 }}>
            {selected.label}{' '}
            <ThemedText type="small" themeColor="accent" style={{ fontWeight: '600' }}>
              ({selected.symbol})
            </ThemedText>
          </ThemedText>
        </View>
        <AppIcon name={UI_ICONS.chevronDown} tintColor={theme.accent} size={20} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}>
          <Pressable
            style={{
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: Spacing.four,
              borderTopRightRadius: Spacing.four,
              borderCurve: 'continuous',
              maxHeight: '60%',
              paddingBottom: Spacing.five,
            }}
            onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: Spacing.three,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}>
              <ThemedText type="smallBold">Select unit</ThemedText>
            </View>
            <ScrollView contentContainerStyle={{ padding: Spacing.three, gap: Spacing.one }}>
              {units.map((unit) => {
                const isSelected = unit.id === selectedUnitId;
                return (
                  <Pressable
                    key={unit.id}
                    onPress={() => handleSelect(unit)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: 48,
                      paddingHorizontal: Spacing.three,
                      borderRadius: Spacing.three,
                      borderCurve: 'continuous',
                      backgroundColor: isSelected ? theme.accentMuted : 'transparent',
                      borderWidth: isSelected ? 1 : 0,
                      borderColor: theme.accent,
                      opacity: pressed ? 0.8 : 1,
                    })}>
                    <ThemedText type="small" style={{ fontWeight: isSelected ? '700' : '500' }}>
                      {unit.label}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" selectable>
                      {unit.symbol}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
