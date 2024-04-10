import React from "react";
import Box from "@mui/material/Box";
import { TestRun, Test } from "@/client";
import { green, grey, red, yellow } from "@mui/material/colors";

type TestRunOrTest = TestRun | Test;

interface StatusProps<T extends TestRunOrTest> {
  item: T;
}

const Status = <T extends TestRunOrTest>(props: StatusProps<T>) => {
  const { item } = props;

  let color = "";
  if (item && "failed" in item && (item.failed as number) > 0) {
    color = red[500];
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
  if (item && "status" in item && item.status === null) {
    color = grey[500];
  }

  return (
    <Box
      sx={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        display: "inline-block",
        margin: "0",
        padding: "0",
        position: "relative",
        background: color ? color : green[500],
        boxSizing: "border-box",
      }}
    ></Box>
  );
};

export default Status;
