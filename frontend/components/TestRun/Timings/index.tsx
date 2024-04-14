"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TestRun } from "@/client";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {formatDuration} from "@/tools/format-duration";

dayjs.extend(duration);

interface TimingsProps {
  testRun: TestRun;
}

export const Timings = ({ testRun }: TimingsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ display: "flex", width: "80px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Started:</Typography>
        </Box>
        <Box>
          {dayjs(testRun?.startedAt as string)
            .format("DD MMM YYYY HH:mm:ss")
            .toString()}
        </Box>
      </Box>
      {testRun.stoppedAt && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Stopped:</Typography>
          </Box>
          <Box>
            {dayjs(testRun?.stoppedAt as string)
              .format("DD MMM YYYY HH:mm:ss")
              .toString()}
          </Box>
        </Box>
      )}
      {testRun.stoppedAt && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Duration:</Typography>
          </Box>
          <Box>
            {formatDuration(
              testRun?.startedAt as string,
              testRun?.stoppedAt as string,
            ).toString()}
          </Box>
        </Box>
      )}
    </Box>
  );
};
