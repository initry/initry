"use client";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Test, TestRun } from "@/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { RowStatus } from "@/components/RowStatus";
import { TestStatusLabel } from "@/components/TestRow/TestStatus";
import { formatDuration } from "@/tools/format-duration";

interface TestRowProps {
  testRun: TestRun;
  test: Test;
}

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const TestRow = ({ test, testRun }: TestRowProps) => {
  const { stoppedAt, startedAt } = test;

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
