import { StyleSheet, View } from "react-native";
import { DriveEvent } from "@/types/drive";
import { AppText } from "./AppText";
import { Card } from "./Card";

type EventTimelineProps = {
  events: DriveEvent[];
};

export function EventTimeline({ events }: EventTimelineProps) {
  const visibleEvents = events.slice(0, 6);

  return (
    <Card>
      <AppText style={styles.title}>Event Timeline</AppText>
      {visibleEvents.length === 0 ? (
        <AppText style={styles.empty}>No events yet. Start a drive and move the phone sharply to simulate driving events.</AppText>
      ) : (
        <View style={styles.list}>
          {visibleEvents.map((event) => (
            <View key={event.id} style={styles.row}>
              <View style={styles.dot} />
              <View style={styles.eventDetails}>
                <AppText style={styles.label}>{event.label}</AppText>
                <AppText style={styles.detail}>{event.detail}</AppText>
              </View>
              <AppText style={styles.points}>-{event.points}</AppText>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  empty: {
    color: "#93A4B8",
  },
  list: {
    gap: 12,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    backgroundColor: "#38BDF8",
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  eventDetails: {
    flex: 1,
  },
  label: {
    color: "#E5EDF8",
    fontWeight: "800",
  },
  detail: {
    color: "#93A4B8",
    fontSize: 13,
  },
  points: {
    color: "#FCA5A5",
    fontSize: 16,
    fontWeight: "800",
  },
});
