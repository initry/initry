"use client";
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { TestRun } from "@/client";
import { FrameworkLogo } from "@/components/TestRun/FrameworkLogo";

interface TestRunStatusInterface {
  testRun: TestRun;
}

type ChipColor =  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';


export const TestRunStatus = (props: TestRunStatusInterface) => {
  const { testRun } = props;

  const getChipProps = () => {
        if (!testRun.stoppedAt) {
            return {label: "Running", color: "info"};
        } else {
            switch (true) {
                case testRun.failed as number > 0:
                    return { label: "Failed", color: "error" };
                case testRun.failed === 0:
                    return { label: "Passed", color: "success" };
                default:
                    return { label: "Unknown", color: "default" };
            }
        }
    }

    const { label, color } = getChipProps();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
          <Chip
              label={label}
              sx={{ fontSize: "16px" }}
              color={color as ChipColor}
              variant="filled"
          />
      </Box>
      <Box>
        <FrameworkLogo framework={testRun?.pluginType} />
      </Box>
    </Box>
  );
};
