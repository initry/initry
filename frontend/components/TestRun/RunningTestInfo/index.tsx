import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { FrameworkLogo } from "@/components/TestRun/FrameworkLogo";
import { Location, TestRun } from "@/client";

interface RunningTestInfoInterface {
  uuid: string;
  location?: Location;
}

interface RunningTestsInterface {
  runningTests: RunningTestInfoInterface[];
  testRun: TestRun;
}

export const RunningTestInfo = (props: RunningTestsInterface) => {
  const { runningTests, testRun } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Typography variant="h6" sx={{ color: blue[500] }}>
          Now running:&nbsp;
          {runningTests.map((r) => r.location as string)}
        </Typography>
      </Box>
      <Box>
        <FrameworkLogo framework={testRun?.pluginType} />
      </Box>
    </Box>
  );
};
