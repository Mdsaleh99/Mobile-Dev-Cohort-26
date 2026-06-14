import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Text,
  View,
} from "react-native";

async function saveToGallery(uri: string) {
  // `true` = request write access (needed to save on iOS)
  const { granted, canAskAgain } =
    await MediaLibrary.requestPermissionsAsync(true);

  if (!granted) {
    if (!canAskAgain) {
      Alert.alert(
        "Photo library access denied",
        "Enable photo library access in Settings to save photos.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
    }
    throw new Error("Photo library permission denied");
  }

  const asset = await MediaLibrary.saveToLibraryAsync(uri);
  return asset;
}

export default function PhotoSaveScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [ready, setReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // --- Camera permission loading ---
  if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Checking camera permission…</Text>
      </View>
    );
  }

  // --- Camera permission not granted ---
  if (!cameraPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Camera access</Text>
        <Text>We need camera access to take a photo.</Text>
        {!cameraPermission.canAskAgain ? (
          <Button
            title="Open Settings"
            onPress={() => Linking.openSettings()}
          />
        ) : (
          <Button
            title="Grant camera access"
            onPress={requestCameraPermission}
          />
        )}
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current || !ready) {
      Alert.alert(
        "Camera not ready",
        "Wait for the preview before taking a photo.",
      );
      return;
    }

    try {
      setStatus(null);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });

      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setStatus("Photo captured (stored in app cache).");
      }
    } catch (error) {
      Alert.alert(
        "Photo failed",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  const handleSaveToGallery = async () => {
    if (!photoUri) return;

    setSaving(true);
    setStatus("Saving to gallery…");

    try {
      await saveToGallery(photoUri);
      setStatus("Photo saved to your gallery.");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "Photo library permission denied"
      ) {
        Alert.alert("Save failed", error.message);
      }
      setStatus("Could not save to gallery.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Live preview — only while no photo is selected */}
      {!photoUri && (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          mode="picture"
          onCameraReady={() => setReady(true)}
          onMountError={({ message }) => setStatus(message)}
        />
      )}

      {/* Captured photo preview */}
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      )}

      {/* Controls */}
      <View style={{ padding: 16, gap: 8 }}>
        {!photoUri ? (
          <Button title="Take photo" onPress={takePhoto} disabled={!ready} />
        ) : (
          <>
            <Button
              title={saving ? "Saving…" : "Save to gallery"}
              onPress={handleSaveToGallery}
              disabled={saving}
            />
            <Button
              title="Retake"
              onPress={() => {
                setPhotoUri(null);
                setStatus(null);
                setReady(false);
              }}
            />
          </>
        )}

        {status && <Text>{status}</Text>}
      </View>
    </View>
  );
}
