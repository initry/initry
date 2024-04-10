"use client";
import { TestRun } from "@/client";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { red, yellow } from "@mui/material/colors";

interface TestsInfoProps {
  testRun: TestRun;
}

export const TestsInfo = ({ testRun }: TestsInfoProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {(testRun.passed as number) > 0 && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Passed:</Typography>
          </Box>
          <Box>{testRun?.passed as number}</Box>
        </Box>
      )}
      {(testRun.failed as number) > 0 && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Failed:</Typography>
          </Box>
          <Box>
            <Typography
              sx={{ color: (testRun?.failed as number) > 0 ? red[500] : "" }}
            >
              {testRun?.failed as number}
            </Typography>
          </Box>
        </Box>
      )}
      {(testRun.skipped as number) > 0 && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Skipped:</Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: (testRun?.skipped as number) > 0 ? yellow[900] : "",
              }}
            >
              {testRun?.skipped as number}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
