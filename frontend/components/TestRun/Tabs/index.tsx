import { Box, Divider, Paper, Tab, Typography } from "@mui/material";
import React from "react";
import Tabs from "@mui/material/Tabs";
import { TestRow } from "@/components/TestRow";
import { Test, TestRun } from "@/client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabsProps {
  testRun: TestRun;
  tests: Test[];
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const TabsComponent = (props: TabsProps) => {
  const { tests, testRun } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tests" {...a11yProps(0)} />
          <Tab label="XML" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Paper elevation={0} sx={{ width: "70vw" }}>
            {tests &&
              tests.map((t, idx) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "20px",
                    }}
                  >
                    <TestRow test={t} testRun={testRun} />
                  </Box>
                  {idx < tests.length - 1 && (
                    <Divider flexItem key={`divider-${t.uuid}`} />
                  )}
                </>
              ))}
          </Paper>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
};
