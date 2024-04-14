import { Startedat, Stoppedat } from "@/client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const formatDuration = (
  startedAt: Startedat,
  stoppedAt: Stoppedat | undefined,
) => {
  const durationObj = dayjs.duration(
    dayjs(stoppedAt as string, { format: "YYYY-MM-DDTHH:mm:ss" }).diff(
      dayjs(startedAt as string, { format: "YYYY-MM-DDTHH:mm:ss" }),
    ),
  );

  let durationString = "";

  if (durationObj.days() !== 0) {
    durationString += `${durationObj.days()}d `;
  }

  if (
    durationObj.hours() !== 0 ||
    durationObj.minutes() !== 0 ||
    durationObj.days() !== 0
  ) {
    if (durationObj.hours() !== 0) {
      durationString += `${durationObj.hours()}h `;
    }
    if (durationObj.minutes() !== 0 || durationObj.days() !== 0) {
      durationString += `${durationObj.minutes()}m `;
    }
  }

  durationString += `${durationObj.seconds()}s`;

  return durationString;
};
