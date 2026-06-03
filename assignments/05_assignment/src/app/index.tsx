import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { DriveControls } from "@/components/DriveControls";
import { EventBreakdownCard } from "@/components/EventBreakdownCard";
import { EventTimeline } from "@/components/EventTimeline";
import { MetricGrid } from "@/components/MetricGrid";
import { ScoreCard } from "@/components/ScoreCard";
import { SensorStatusCard } from "@/components/SensorStatusCard";
import { ThresholdsCard } from "@/components/ThresholdsCard";
import { formatDuration } from "@/lib/formatters";
import { useDriveSession } from "@/hooks/useDriveSession";

export default function Index() {
  const driveSession = useDriveSession();
  const statusText = driveSession.isDriving
    ? "Recording"
    : driveSession.endedAt
      ? "Completed"
      : "Ready";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <AppText style={styles.kicker}>Sensor-based simulation</AppText>
          <AppText style={styles.title}>Driving Safety Score</AppText>
          <AppText style={styles.subtitle}>
            Start a drive and move the phone to mimic harsh braking, sharp turns,
            aggressive steering, and possible phone handling.
          </AppText>
        </View>

        <DriveControls
          isDriving={driveSession.isDriving}
          onEnd={driveSession.endDrive}
          onStart={driveSession.startDrive}
        />

        <ScoreCard
          isDriving={driveSession.isDriving}
          rating={driveSession.rating}
          score={driveSession.score}
        />

        <MetricGrid
          duration={formatDuration(driveSession.elapsedSeconds)}
          status={statusText}
          totalEvents={driveSession.events.length}
        />

        <EventBreakdownCard breakdown={driveSession.eventBreakdown} />
        <EventTimeline events={driveSession.events} />
        <SensorStatusCard
          availability={driveSession.sensorAvailability}
          snapshot={driveSession.sensorSnapshot}
        />
        <ThresholdsCard rules={driveSession.eventRules} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#020617",
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 34,
  },
  hero: {
    gap: 8,
    paddingTop: 12,
  },
  kicker: {
    color: "#38BDF8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  subtitle: {
    color: "#A8B3C7",
  },
});
