import React from 'react';
import { Pressable, ScrollView } from 'react-native';

import { AppIcon } from '@/components/app-icon';
import { ThemedText } from '@/components/themed-text';
import { CATEGORY_ICONS } from '@/constants/icons';
import { Spacing } from '@/constants/theme';
import { CATEGORIES, type ConverterCategory } from '@/lib/converters';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  selected: ConverterCategory;
  onSelect: (category: ConverterCategory) => void;
};

export function CategoryTabs({ selected, onSelect }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: Spacing.two,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.one,
        alignItems: 'center',
      }}>
      {CATEGORIES.map((category) => {
        const isActive = category.id === selected;
        const icon = CATEGORY_ICONS[category.id];

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.two,
              paddingHorizontal: Spacing.three,
              paddingVertical: 10,
              borderRadius: Spacing.four,
              borderCurve: 'continuous',
              backgroundColor: isActive ? theme.accentMuted : theme.backgroundElement,
              borderWidth: 1,
              borderColor: isActive ? theme.accent : theme.border,
              opacity: pressed ? 0.8 : 1,
            })}>
            <AppIcon
              name={icon}
              tintColor={isActive ? theme.accent : theme.textSecondary}
              size={18}
              weight={isActive ? 'semibold' : 'regular'}
            />
            <ThemedText
              type="small"
              style={{
                color: isActive ? theme.text : theme.textSecondary,
                fontWeight: isActive ? '600' : '500',
                lineHeight: 18,
              }}>
              {category.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
