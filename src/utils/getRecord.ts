import { timeToSeconds } from "@utils/formatter.ts";

export default function getRecord(currentTimer: string): string {
  const storedRecord = localStorage.getItem("record");

  if (storedRecord) {
    const { timer: storedTimer } = JSON.parse(storedRecord);
    if (timeToSeconds(storedTimer) < timeToSeconds(currentTimer)) {
      return storedTimer;
    } else {
      localStorage.setItem("record", JSON.stringify({ timer: currentTimer }));
      return currentTimer;
    }
  } else {
    localStorage.setItem("record", JSON.stringify({ timer: currentTimer }));
    return currentTimer;
  }
}
