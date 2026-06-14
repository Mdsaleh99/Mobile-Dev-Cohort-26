import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioPlayerStatus,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-native";

const SAMPLE_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

export default function RecordAndPlayScreen() {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const player = useAudioPlayer(SAMPLE_URL, { downloadFirst: true });
  const playerStatus = useAudioPlayerStatus(player);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  useEffect(() => {
    (async () => {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (permission.granted) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      }
    })();
  }, []);

  const ensureMic = async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Microphone required", "Grant mic access to record.");
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    if (!(await ensureMic())) return;
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    if (recorder.uri) {
      setRecordingUri(recorder.uri);
    }
  };

  const playSample = () => {
    player.replace(SAMPLE_URL);
    player.seekTo(0);
    player.play();
  };

  const playRecording = () => {
    if (!recordingUri) {
      Alert.alert("No recording", "Record something first.");
      return;
    }
    player.replace(recordingUri);
    player.play();
  };

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", gap: 10, padding: 24 }}
    >
      <ThemedText>
        Player: {playerStatus.playing ? "Playing" : "Paused"}
      </ThemedText>

      <Button
        title={playerStatus.playing ? "Pause" : "Resume"}
        onPress={() => (playerStatus.playing ? player.pause() : player.play())}
      />
      <Button title="Play sample" onPress={playSample} />
      <Button
        title="Play my recording"
        onPress={playRecording}
        disabled={!recordingUri}
      />

      <ThemedText>
        Recorder: {recorderState.isRecording ? "Recording…" : "Idle"} ·{" "}
        {Math.round(recorderState.durationMillis / 1000)}s
      </ThemedText>

      <Button
        title={recorderState.isRecording ? "Stop recording" : "Start recording"}
        onPress={recorderState.isRecording ? stopRecording : startRecording}
      />

      {recordingUri && (
        <ThemedText selectable numberOfLines={2}>
          {recordingUri}
        </ThemedText>
      )}
    </ThemedView>
  );
}
