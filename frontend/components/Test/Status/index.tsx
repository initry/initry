"use client";
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Test, TestRun } from "@/client";
import { yellow } from "@mui/material/colors";
import { FrameworkLogo } from "@/components/TestRun/FrameworkLogo";

interface TestStatusInterface {
  test: Test;
  testRun: TestRun;
}

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export const TestStatus = ({ test, testRun }: TestStatusInterface) => {
  const getChipProps = () => {
    if (!test.stoppedAt && testRun.pluginType == "pytest") {
      return { label: "Running", color: "info" };
    } else {
      switch (test.status) {
        case "FAILED":
          return { label: "Failed", color: "error" };
        case "PASSED":
          return { label: "Passed", color: "success" };
        case "SKIPPED":
          return {
            label: "Skipped",
            color: "primary",
            backgroundColor: yellow[700],
          };
        default:
          return { label: "Unknown", color: "default" };
      }
    }
  };

  const { label, color, backgroundColor } = getChipProps();

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
          style={{ backgroundColor }}
        />
      </Box>
      <Box>
        <FrameworkLogo framework={testRun?.pluginType} />
      </Box>
    </Box>
  );
};
