"use client";
import Box from "@mui/material/Box";
import { Divider, Paper, Typography } from "@mui/material";
import { TestRun, TestRunsApi, StatsApi, TestRunsTrend, Test } from "@/client";
import React, { useEffect, useRef, useState } from "react";
import { TrendBarChart } from "@/components/TrendBarChart";
import { FailuresChart } from "@/components/FailuresChart";
import { TestRunRow } from "@/components/TestRunRow";
import { Loading } from "@/components/Loading/Loading";

const getLatestTestRuns = () => {
  return new TestRunsApi().getLatestTestRuns();
};

const getTestRunsTrend = () => {
  return new StatsApi().getTrendData();
};

const Dashboard = () => {
  const [loadingTestRuns, setLoadingTestRuns] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
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
              (updatedTestRun.passed as number) > 0
                ? (updatedTestRun.passed as number) + 1
                : 1;
          }
          if (newData.status === "FAILED") {
            updatedTestRun.failed =
              (updatedTestRun.failed as number) > 0
                ? (updatedTestRun.failed as number) + 1
                : 1;
          }
          if (newData.status === "SKIPPED") {
            updatedTestRun.skipped =
              (updatedTestRun.skipped as number) > 0
                ? (updatedTestRun.skipped as number) + 1
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
      setLoadingTestRuns(true);
      try {
        const latestTestRuns = await getLatestTestRuns();
        setTestRuns(latestTestRuns.data);
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoadingTestRuns(false);
      }
    };

    const fetchTrend = async () => {
      try {
        setLoadingCharts(true);
        const data = await getTestRunsTrend();
        setTestRunsDataByDay(data.data);
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchLatestTestRuns();
    fetchTrend();

    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        `ws://${process.env.NEXT_PUBLIC_INITRY_API_HOST}:${process.env.NEXT_PUBLIC_INITRY_API_EXTERNAL_PORT}/ws/live`,
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
          {loadingTestRuns ? (
            <Loading />
          ) : (
            <>
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
            </>
          )}
        </Box>

        {loadingCharts ? (
          <Loading />
        ) : (
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
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
