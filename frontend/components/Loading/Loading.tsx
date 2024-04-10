import React from "react";
import Box from "@mui/material/Box";
import "./loader.css";

export const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="loader"></div>
    </Box>
  );
};
