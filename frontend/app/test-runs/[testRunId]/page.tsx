"use client";
import React, { useEffect, useRef, useState } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TestRunsApi } from "@/client/api/test-runs-api";
import { Test, TestRun, TestsApi } from "@/client";
import { TestRunStatus } from "@/components/TestRun/Status";
import { TestRunDetails } from "@/components/TestRunDetails";
import { RunningTestInfo } from "@/components/TestRun/RunningTestInfo";
import { Loading } from "@/components/Loading/Loading";
import { TestRow } from "@/components/TestRow";
import { StatusChart } from "@/components/TestRun/StatusChart";

const getTestRunById = (testRunId: string) => {
  return new TestRunsApi().getTestRunById(testRunId);
};

const getTestRunTests = (testRunId: string) => {
  return new TestsApi().getTestsFromTestRun(testRunId);
};

const getRunningTestRunTests = (testRunId: string) => {
  return new TestsApi().getRunningTestsFromTestRun(testRunId);
};

const TestRunPage = ({ params }: { params: { testRunId: string } }) => {
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const [testRun, setTestRun] = useState<TestRun>({
    failed: undefined,
    passed: undefined,
    pluginType: "",
    runName: "",
    skipped: undefined,
    startedAt: undefined,
    stoppedAt: undefined,
    testsCount: 0,
    uuid: "",
  });
  const [tests, setTests] = useState<Test[]>([]);
  const [runningTests, setRunningTests] = useState<
    { uuid: string; location: string }[]
  >([]);

  const handleTestRunData = (data: TestRun) => {
    try {
      const newData: TestRun = data;
      setTestRun((prevTestRun) => {
        return { ...prevTestRun, ...newData };
      });
    } catch (error) {
      console.error("Error in handleTestRunData:", error);
    }
  };

  const handleTestData = (data: Test) => {
    try {
      const newData = data;
      if (newData.status === "RUNNING") {
        // setRunningTests((prevState) => [
        //   ...prevState,
        //   { uuid: newData.uuid, location: newData.location },
        // ]);
        setRunningTests([
          { uuid: newData.uuid, location: newData.location as string },
        ]);
        setTests((prevState) =>
          prevState.map((test) => {
            if (test.uuid === newData.uuid) {
              return { ...test, ...newData };
            }
            return test;
          }),
        );
      }
      if (newData.status !== "RUNNING") {
        setTests((prevState) =>
          prevState.map((test) => {
            if (test.uuid === newData.uuid) {
              return { ...test, ...newData };
            }
            return test;
          }),
        );
        setRunningTests((prevState) =>
          prevState.filter((item) => item.uuid !== newData.uuid),
        );
        setTestRun((prevState) => {
          const updatedTestRun = { ...prevState };
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
          return updatedTestRun;
        });
      }
    } catch (error) {
      console.error("Error in handleTestData:", error);
    }
  };

  useEffect(() => {
    const getTestRun = async () => {
      try {
        const data = await getTestRunById(params.testRunId);
        setTestRun(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test run:", error);
      }
    };

    const getTests = async () => {
      try {
        const data = await getTestRunTests(params.testRunId);
        setTests(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    const getRunningTests = async () => {
      try {
        const data = await getRunningTestRunTests(params.testRunId);
        setRunningTests([
          {
            uuid: data.data[0]["uuid"],
            location: data.data[0]["location"] as string,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching running tests:", error);
      }
    };

    getTestRun();
    getTests();
    getRunningTests().then();

    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        `ws://${process.env.NEXT_PUBLIC_INITRY_API_HOST}:${process.env.NEXT_PUBLIC_INITRY_API_EXTERNAL_PORT}/ws/test-run/${params.testRunId}`,
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

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [params.testRunId]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {!testRun?.stoppedAt && (
            <RunningTestInfo runningTests={runningTests} testRun={testRun} />
          )}
          {testRun?.stoppedAt && <TestRunStatus testRun={testRun} />}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "80px",
              paddingTop: "10px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography sx={{ marginTop: "10px" }} variant="h6">
                {testRun?.runName}
              </Typography>
              <TestRunDetails testRun={testRun} />
              <Box sx={{ paddingTop: "20px" }}>
                <StatusChart testRun={testRun} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography sx={{ marginTop: "10px" }} variant="h6">
                Tests:
              </Typography>
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
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default TestRunPage;
