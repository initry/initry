import React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { TestRun, Startedat, Stoppedat } from "@/client";
import Link from "next/link";
import Status from "@/components/TestRunRow/Status";
import { Loader } from "@/components/TestRunRow/Loader";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { grey } from "@mui/material/colors";

interface TestRunRowProps {
  testRun: TestRun;
}

dayjs.extend(relativeTime);
dayjs.extend(duration);

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "150%", mr: 2 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{ height: "10px" }}
        />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const TestRunRow = ({ testRun }: TestRunRowProps) => {
  const { stoppedAt, startedAt, testsCount, passed, failed, skipped } = testRun;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalProcessed =
      ((passed as number) || 0) +
      ((failed as number) || 0) +
      ((skipped as number) || 0);
    const percentageProgress = (totalProcessed / (testsCount as number)) * 100;
    setProgress(percentageProgress.toFixed(2) as unknown as number); // TODO
  }, [testRun, passed, failed, skipped, testsCount]);

  const formatDuration = (startedAt: Startedat, stoppedAt: Stoppedat) => {
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

  return (
    <>
      <Link href={`/test-runs/${testRun.uuid}`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            ml: 2,
            mb: 2,
            mt: 2,
            mr: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {startedAt && !stoppedAt && <Loader<TestRun> item={testRun} />}
            {stoppedAt && <Status<TestRun> item={testRun} />}
          </Box>

          <Box sx={{ display: "flex", width: "100%", mr: 2 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  gap: "15px",
                  //justifyContent: 'space-between',
                  mt: 1,
                  mb: 1,
                }}
              >
                <Tooltip title="Test run generated name">
                  <Box sx={{ display: "flex", minWidth: "120px" }}>
                    <Typography
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {testRun.runName}
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title="Total tests in test run">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      label={testsCount !== undefined ? testsCount : "0"}
                      sx={{ height: "16px" }}
                      variant="outlined"
                    />
                  </Box>
                </Tooltip>
                <Tooltip
                  title={
                    stoppedAt
                      ? dayjs(testRun.stoppedAt as string).toString()
                      : dayjs(testRun.stoppedAt as string).toString()
                  }
                  placement="bottom"
                >
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="caption"
                      sx={{ flex: "0 0 auto", ml: 2 }}
                    >
                      {stoppedAt
                        ? `Ended: ${dayjs(testRun.stoppedAt as string).fromNow()}`
                        : `Started ${dayjs(startedAt as string).fromNow()}`}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {stoppedAt && (
                  <Tooltip title="Duration">
                    <Box sx={{ display: "flex" }}>
                      <HistoryToggleOffIcon
                        fontSize="inherit"
                        sx={{ color: grey[500] }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ ml: 1, color: grey[500] }}
                      >
                        {formatDuration(startedAt as string, stoppedAt)}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
                {!stoppedAt && (
                  <Tooltip title="Execution progress">
                    <Box sx={{ width: "150%" }}>
                      <LinearProgressWithLabel value={progress} />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </>
  );
};
