"use client";
import Box from "@mui/material/Box";
import { Divider, Paper, Typography } from "@mui/material";
import { TestRun, TestRunsApi, StatsApi, TestRunsTrend, Test } from "@/client";
import React, { useEffect, useRef, useState } from "react";
import { TrendBarChart } from "@/components/TrendBarChart";
import { FailuresChart } from "@/components/FailuresChart";
import { TestRunRow } from "@/components/TestRunRow";

const getLatestTestRuns = () => {
  return new TestRunsApi().getLatestTestRuns();
};

const getTestRunsTrend = () => {
  return new StatsApi().getTrendData();
};

const Dashboard = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [testRuns, setTestRuns] = useState<TestRun[]>([
    {
      uuid: "",
      runName: "",
      pluginType: "",
    },
  ]);
  const [testRunsDataByDay, setTestRunsDataByDay] = useState<TestRunsTrend>({
    failed: [],
    passed: [],
    skipped: [],
  });

  const handleTestRunData = (data: TestRun) => {
    try {
      const newData: TestRun = data;
      setTestRuns((prevTestRuns) => {
        const existingTrIndex = prevTestRuns.findIndex(
          (tr) => tr.uuid === newData.uuid,
        );
        if (existingTrIndex !== -1) {
          const updatedTestRuns = [...prevTestRuns];
          updatedTestRuns[existingTrIndex] = {
            ...updatedTestRuns[existingTrIndex],
            ...newData,
          };
          return updatedTestRuns;
        } else {
          return [newData, ...prevTestRuns]; // todo check wrong uuid scenario
        }
      });
    } catch (error) {
      console.error("Error parsing WebSocket data:", error);
    }
  };

  const handleTestData = (data: Test) => {
    try {
      const newData = data;
      setTestRuns((prevTestRuns) => {
        const existingTrIndex = prevTestRuns.findIndex(
          (tr) => tr.uuid === newData.testRunUuid,
        );
        if (existingTrIndex !== -1) {
          const updatedTestRuns = [...prevTestRuns];
          const updatedTestRun = { ...updatedTestRuns[existingTrIndex] };
          if (newData.status === "PASSED") {
            updatedTestRun.passed =
              parseInt(updatedTestRun.passed as string, 10) > 0
                ? parseInt(updatedTestRun.passed as string, 10) + 1
                : 1;
          }
          if (newData.status === "FAILED") {
            updatedTestRun.failed =
              parseInt(updatedTestRun.failed as string, 10) > 0
                ? parseInt(updatedTestRun.failed as string, 10) + 1
                : 1;
          }
          if (newData.status === "SKIPPED") {
            updatedTestRun.skipped =
              parseInt(updatedTestRun.skipped as string, 10) > 0
                ? parseInt(updatedTestRun.skipped as string, 10) + 1
                : 1;
          }
          if (newData.status === "RUNNING") {
            return updatedTestRuns;
          }
          updatedTestRuns[existingTrIndex] = updatedTestRun;
          return updatedTestRuns;
        } else {
          return prevTestRuns; // todo check wrong uuid scenario
        }
      });
    } catch (error) {
      console.error("Error parsing WebSocket test data:", error);
    }
  };

  useEffect(() => {
    const fetchLatestTestRuns = async () => {
      try {
        const latestTestRuns = await getLatestTestRuns();
        setTestRuns(latestTestRuns.data);
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      }
    };

    const fetchTrend = async () => {
      try {
        const data = await getTestRunsTrend();
        setTestRunsDataByDay(data.data);
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      }
    };

    fetchLatestTestRuns();
    fetchTrend();

    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        "ws://localhost:" +
          process.env.NEXT_PUBLIC_INITRY_API_EXTERNAL_PORT +
          "/ws/live",
      );

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (typeof data === "object" && data !== null && "type" in data) {
          if (data.type === "test_run") {
            handleTestRunData(data);
          }
          if (data.type === "test") {
            handleTestData(data);
          }
        }
      };

      socketRef.current.onclose = () => {};
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null; // Reset socket reference
      }
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "50px" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            gap: "20px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              sx={{ marginTop: "10px", marginBottom: "25px" }}
              variant="h6"
            >
              Test runs:
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Paper elevation={0} sx={{ width: "98%" }}>
              {testRuns &&
                testRuns.map((testRun, idx) => (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        paddingBottom: "20px",
                      }}
                    >
                      <TestRunRow key={idx} testRun={testRun} />
                    </Box>
                    {idx < testRuns.length - 1 && (
                      <Divider flexItem key={`divider-${testRun.uuid}`} />
                    )}
                  </>
                ))}
            </Paper>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            gap: "20px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ marginTop: "10px" }} variant="h6">
              Trend (7d):
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <TrendBarChart testRunsDataByDay={testRunsDataByDay} />
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">Failures (7d):</Typography>{" "}
          </Box>
          <Box sx={{ display: "flex" }}>
            <FailuresChart testRunsDataByDay={testRunsDataByDay} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
