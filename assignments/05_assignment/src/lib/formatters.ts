export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatSensorValue(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return value.toFixed(2);
}
