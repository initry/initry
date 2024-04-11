import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Test } from "@/client";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { RowStatus } from "@/components/RowStatus";
import { TestStatusLabel } from "@/components/TestRow/TestStatus";

interface TestRowProps {
  test: Test;
}

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const TestHistoryRow = ({ test }: TestRowProps) => {
  const formattedDate = dayjs(test.startedAt?.toString()).format(
    "DD MMM YYYY HH:mm:ss",
  );

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
                    <Typography variant="h5">{formattedDate}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};
