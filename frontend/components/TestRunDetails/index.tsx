"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TestRun } from "@/client";
import Box from "@mui/material/Box";
import { Chip, Typography } from "@mui/material";
import { formatDuration } from "@/tools/format-duration";
import { grey } from "@mui/material/colors";

dayjs.extend(duration);

interface Props {
  testRun: TestRun;
}

export const TestRunDetails = ({ testRun }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "250px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <Box sx={{ display: "flex", width: "80px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Source:</Typography>
        </Box>
        <Box>
          {testRun.pluginType === "pytest.initry" && (
            <Chip
              size="small"
              label="pytest-initry"
              color="info"
              variant="outlined"
            />
          )}
          {testRun.pluginType === "pytest.xml" && (
            <>
              <Chip
                size="small"
                label="Pytest JUnit XML"
                sx={{ backgroundColor: grey[100] }}
                variant="outlined"
              />
            </>
          )}
          {testRun.pluginType === "pytest.initry.xml" && (
            <>
              <Chip
                size="small"
                label="pytest-initry + JUnit XML"
                color="info"
                variant="outlined"
              />
            </>
          )}
        </Box>
      </Box>
      {testRun.testSuite && (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Testsuite:</Typography>
          </Box>
          <Box>{testRun.testSuite}</Box>
        </Box>
      )}
      {testRun.hostName && (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Hostname:</Typography>
          </Box>
          <Box>{testRun.hostName}</Box>
        </Box>
      )}
    </Box>
  );
};
