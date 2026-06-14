import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Button, StyleSheet } from "react-native";

const Camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) {
    return <ThemedText>Loading Permissions...</ThemedText>;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <ThemedText style={{ marginBottom: 16 }}>
          We need camera access to take photos.
        </ThemedText>
        <Button title="Grant camera access" onPress={requestPermission} />
      </ThemedView>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 1 });
    if (photo?.uri) setPhotoUri(photo.uri);
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        onCameraReady={() => setReady(true)}
        onMountError={({ message }) => console.warn(message)}
      />

      <Button title="Take photo" onPress={takePhoto} disabled={!ready} />
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ height: 200 }}
          contentFit="cover"
        />
      )}
      <ThemedText style={{ padding: 12 }}>
        {ready ? "Camera ready" : "Starting camera…"}
      </ThemedText>
    </ThemedView>
  );
};
export default Camera;

const styles = StyleSheet.create({});