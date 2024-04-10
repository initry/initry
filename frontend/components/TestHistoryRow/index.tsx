import React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Loader } from "@/components/TestRunRow/Loader";
import Status from "@/components/TestRunRow/Status";
import { Test } from "@/client";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

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
    <>
      <Link href={`/tests/${test.uuid}`}>
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
            {test.status === "RUNNING" ? (
              <Loader<Test> item={test} />
            ) : (
              <Status<Test> item={test} />
            )}
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
                  mt: 1,
                  mb: 1,
                }}
              >
                <Tooltip title="Test name">
                  <Box sx={{ display: "flex", minWidth: "120px" }}>
                    <Typography
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {formattedDate}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </>
  );
};
