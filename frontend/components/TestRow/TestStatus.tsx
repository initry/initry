"use client";
import { Box, Paper, Typography } from "@mui/material";
import { blue, green, grey, red, yellow } from "@mui/material/colors";
import React from "react";

interface TestStatusProps {
  status: string;
}

const Status = ({ status }: TestStatusProps) => {
  switch (status) {
    case "PASSED":
      return <Typography color={green[500]}>PASSED</Typography>;
    case "FAILED":
      return <Typography color={red[500]}>FAILED</Typography>;
    case "SKIPPED":
      return <Typography color={yellow[800]}>SKIPPED</Typography>;
    case "RUNNING":
      return <Typography color={blue[500]}>RUNNING</Typography>;
    default: {
      return <Typography color={grey[500]}>UNKNOWN</Typography>;
    }
  }
};

export const TestStatusLabel = ({ status }: TestStatusProps) => {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: "25px",
          textAlign: "center",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
        variant={"outlined"}
      >
        <Status status={status} />
      </Paper>
    </Box>
  );
};
