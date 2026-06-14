import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/app-icon';
import { ThemedText } from '@/components/themed-text';
import { UI_ICONS } from '@/constants/icons';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppUpdates } from '@/hooks/use-app-updates';
import { useTheme } from '@/hooks/use-theme';

function ActionButton({
  label,
  onPress,
  loading = false,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => ({
        minHeight: 36,
        paddingHorizontal: Spacing.three,
        borderRadius: Spacing.two,
        borderCurve: 'continuous',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isPrimary ? theme.accentMuted : 'transparent',
        borderWidth: 1,
        borderColor: theme.accent,
        opacity: pressed || loading ? 0.75 : 1,
      })}>
      {loading ? (
        <ActivityIndicator size="small" color={theme.accent} />
      ) : (
        <ThemedText type="smallBold" style={{ color: isPrimary ? theme.text : theme.accent }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

export function UpdateBanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isEnabled,
    isUpdateAvailable,
    isUpdatePending,
    isDownloading,
    isChecking,
    downloadProgress,
    downloadError,
    downloadUpdate,
    applyUpdate,
  } = useAppUpdates();

  if (!isEnabled) return null;

  const showBanner = isUpdateAvailable || isUpdatePending || isDownloading;
  if (!showBanner) return null;

  const title = isUpdatePending
    ? 'Update ready'
    : isDownloading
      ? 'Downloading update'
      : 'Update available';

  const description = isUpdatePending
    ? 'Restart the app to use the latest version.'
    : isDownloading
      ? downloadProgress != null
        ? `${Math.round(downloadProgress * 100)}% complete`
        : 'Fetching the latest version...'
      : 'A new version is ready to install.';

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + Spacing.two,
        left: Spacing.four,
        right: Spacing.four,
        zIndex: 100,
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        width: '100%',
      }}>
      <View
        style={{
          backgroundColor: theme.backgroundElement,
          borderRadius: Spacing.four,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: theme.accent,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}>
        <View style={{ height: 3, backgroundColor: theme.accent }} />

        <View style={{ padding: Spacing.three, gap: Spacing.three }}>
          <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderCurve: 'continuous',
                backgroundColor: theme.accentMuted,
                borderWidth: 1,
                borderColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isChecking || isDownloading ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : (
                <AppIcon name={UI_ICONS.update} tintColor={theme.accent} size={18} weight="semibold" />
              )}
            </View>

            <View style={{ flex: 1, gap: Spacing.half }}>
              <ThemedText type="smallBold">{title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {description}
              </ThemedText>
              {downloadError ? (
                <ThemedText type="small" style={{ color: '#f87171' }}>
                  Could not download the update. Try again.
                </ThemedText>
              ) : null}
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.two }}>
            {isUpdatePending ? (
              <ActionButton label="Restart now" onPress={() => void applyUpdate()} />
            ) : isUpdateAvailable ? (
              <ActionButton
                label="Download"
                onPress={() => void downloadUpdate()}
                loading={isDownloading}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
