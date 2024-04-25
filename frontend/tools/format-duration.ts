import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const formatDuration = (
  startedAt: string,
  stoppedAt: string | undefined,
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

export const formatSeconds = (seconds: number): string => {
  const days: number = Math.floor(seconds / 86400);
  const hours: number = Math.floor((seconds % 86400) / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;

  let result: string = "";
  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${minutes}m `;
  }
  result += `${remainingSeconds.toFixed(0)}s`;

  return result.trim();
};
