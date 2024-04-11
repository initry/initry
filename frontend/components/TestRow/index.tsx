"use client";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Startedat, Stoppedat, Test, TestRun } from "@/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { RowStatus } from "@/components/RowStatus";
import { TestStatusLabel } from "@/components/TestRow/TestStatus";

interface TestRowProps {
  testRun: TestRun;
  test: Test;
}

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const TestRow = ({ test, testRun }: TestRowProps) => {
  const { stoppedAt, startedAt } = test;

  const formatDuration = (
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

  return (
    <Link href={`/tests/${test.uuid}`}>
      <Card variant="outlined">
        <Box sx={{ display: "flex" }}>
          <RowStatus item={test} />
          <Box sx={{ display: "flex" }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    alignItems: "center",
                    verticalAlign: "center",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h5">
                      {test.location as string}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <TestStatusLabel status={test.status} />
                  </Box>
                  {testRun.stoppedAt && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{}} color="text.secondary">
                        {test.stoppedAt
                          ? `Ended: ${dayjs(test.stoppedAt as string).fromNow()}`
                          : `Started ${dayjs(startedAt as string).fromNow()}`}
                      </Typography>
                    </Box>
                  )}
                  {test.startedAt && test.stoppedAt && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{}} color="text.secondary">
                        Duration:{" "}
                        {formatDuration(startedAt as string, stoppedAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};
