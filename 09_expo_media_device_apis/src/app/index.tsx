import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useCallback, useState } from 'react';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';

type PickMode = 'any' | 'image' | 'pdf';

const MODES: { id: PickMode; label: string; type: string }[] = [
  { id: 'any', label: 'Any', type: '*/*' },
  { id: 'image', label: 'Images', type: 'image/*' },
  { id: 'pdf', label: 'PDF', type: 'application/pdf' },
];

type FileDetails = {
  name: string;
  mimeType: string;
  size: string;
  exists: boolean;
  uri: string;
  textPreview?: string;
};

function formatBytes(size?: number | null) {
  if (size == null) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function InfoRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  const displayValue =
    value === undefined || value === null || value === '' ? '—' : String(value);

  return (
    <ThemedView style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText selectable>{displayValue}</ThemedText>
    </ThemedView>
  );
}

function isTextFile(asset: DocumentPicker.DocumentPickerAsset) {
  return (
    asset.mimeType?.startsWith('text/') ||
    asset.name.endsWith('.txt') ||
    asset.name.endsWith('.json') ||
    asset.name.endsWith('.md')
  );
}

export default function FileHandlingScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<PickMode>('any');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [selected, setSelected] = useState<FileDetails | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const inspectFile = useCallback(async (asset: DocumentPicker.DocumentPickerAsset) => {
    if (!asset?.uri) {
      setSelected(null);
      return;
    }

    try {
      const file = new File(asset.uri);
      let exists = false;
      let sizeBytes = asset.size ?? null;

      try {
        exists = file.exists;
        const info = file.info();
        exists = info.exists;
        sizeBytes = info.size ?? asset.size ?? null;
      } catch {
        exists = false;
      }

      let textPreview: string | undefined;
      if (isTextFile(asset) && exists) {
        try {
          textPreview = (await file.text()).slice(0, 240);
        } catch {
          textPreview = undefined;
        }
      }

      setSelected({
        name: asset.name,
        mimeType: asset.mimeType ?? 'Unknown',
        size: formatBytes(sizeBytes),
        exists,
        uri: asset.uri,
        textPreview,
      });
    } catch (error) {
      Alert.alert('Inspect failed', error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  const pickDocuments = async () => {
    const selectedMode = MODES.find((item) => item.id === mode);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: selectedMode?.type,
        multiple: allowMultiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setStatus('Picker canceled.');
        return;
      }

      setFiles(result.assets);
      setStatus(`Picked ${result.assets.length} file${result.assets.length === 1 ? '' : 's'}.`);
      await inspectFile(result.assets[0]);
    } catch (error) {
      Alert.alert('Pick failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedText type="subtitle">File handling</ThemedText>
      <ThemedText>Pick a file, then inspect it with expo-file-system.</ThemedText>

      <ThemedView style={styles.modeRow}>
        {MODES.map((item) => {
          const isActive = mode === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => setMode(item.id)}
              style={[
                styles.modeChip,
                { backgroundColor: isActive ? '#208AEF' : theme.backgroundElement },
              ]}>
              <ThemedText themeColor={isActive ? 'background' : 'text'}>{item.label}</ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>

      <ThemedView style={styles.switchRow}>
        <Switch value={allowMultiple} onValueChange={setAllowMultiple} />
        <ThemedText>Pick multiple files</ThemedText>
      </ThemedView>

      <Button title="Pick file" onPress={pickDocuments} />
      {status && <ThemedText>{status}</ThemedText>}

      {files.length > 0 && (
        <ThemedView style={styles.fileList}>
          <ThemedText style={styles.sectionTitle}>Selected files</ThemedText>
          {files.map((file, index) => {
            const isSelected = selected?.uri === file.uri;

            return (
              <Pressable
                key={`${file.uri}-${index}`}
                onPress={() => inspectFile(file)}
                style={[
                  styles.fileItem,
                  {
                    backgroundColor: isSelected ? theme.backgroundSelected : theme.backgroundElement,
                  },
                ]}>
                <ThemedText style={styles.fileName}>{file.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatBytes(file.size)}
                </ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>
      )}

      {selected && (
        <ThemedView type="backgroundElement" style={styles.detailsCard}>
          <ThemedText style={styles.sectionTitle}>File details</ThemedText>

          <InfoRow label="Name" value={selected.name} />
          <InfoRow label="Type" value={selected.mimeType} />
          <InfoRow label="Size" value={selected.size} />
          <InfoRow label="Exists" value={selected.exists ? 'Yes' : 'No'} />
          <InfoRow label="Path" value={selected.uri} />

          {selected.textPreview && (
            <ThemedView style={styles.previewBlock}>
              <ThemedText type="small" themeColor="textSecondary">
                Preview
              </ThemedText>
              <ThemedText selectable style={styles.previewText}>
                {selected.textPreview}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: Spacing.two,
    borderRadius: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  fileList: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  fileItem: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  fileName: {
    fontWeight: '500',
  },
  detailsCard: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.one,
  },
  infoRow: {
    marginBottom: Spacing.two,
  },
  previewBlock: {
    marginTop: Spacing.two,
  },
  previewText: {
    marginTop: Spacing.one,
  },
});
