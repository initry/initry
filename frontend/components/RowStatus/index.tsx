import React from "react";
import Box from "@mui/material/Box";
import { TestRun, Test } from "@/client";
import { blue, green, grey, red, yellow } from "@mui/material/colors";
import { Paper } from "@mui/material";

type TestRunOrTest = TestRun | Test;

interface StatusProps<T extends TestRunOrTest> {
  item: T;
}

export const RowStatus = <T extends TestRunOrTest>(props: StatusProps<T>) => {
  const { item } = props;

  let color = "";
  if (item && "failed" in item && (item.failed as number) > 0) {
    color = red[500];
  }
  if (
    item &&
    "passed" in item &&
    (item.passed as number) > 0 &&
    (item.failed as number) === 0
  ) {
    color = green[500];
  }
  if (item && "status" in item && item.status === "FAILED") {
    color = red[500];
  }
  if (item && "status" in item && item.status === "SKIPPED") {
    color = yellow[600];
  }
  if (item && "status" in item && item.status === "PASSED") {
    color = green[500];
  }
  if (item && "status" in item && item.status === "RUNNING") {
    color = blue[500];
  }
  if (item && "status" in item && item.status === null) {
    color = grey[500];
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Paper sx={{ backgroundColor: color, width: "2px" }}></Paper>
    </Box>
  );
};
