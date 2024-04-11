"use client";
import React, { useEffect, useRef, useState } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TestRunsApi } from "@/client/api/test-runs-api";
import { Test, TestRun, TestsApi, Location } from "@/client";
import { TestRunStatus } from "@/components/TestRun/Status";
import { Timings } from "@/components/TestRun/Timings";
import { RunningTestInfo } from "@/components/TestRun/RunningTestInfo";
import { Loading } from "@/components/Loading/Loading";
import { TestRow } from "@/components/TestRow";
import { StatusChart } from "@/components/TestRun/StatusChart";
import { TestRunRow } from "@/components/TestRunRow";

const getTestRunById = (testRunId: string) => {
  return new TestRunsApi().getTestRunById(testRunId);
};

const getTestRunTests = (testRunId: string) => {
  return new TestsApi().getTestsFromTestRun(testRunId);
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
    { uuid: string; location?: Location }[]
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
        setRunningTests((prevState) => [
          ...prevState,
          { uuid: newData.uuid, location: newData.location },
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
        console.error("Error fetching test run:", error);
      }
    };

    getTestRun();
    getTests();

    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        "ws://localhost:" +
          process.env.NEXT_PUBLIC_INITRY_API_EXTERNAL_PORT +
          "/ws/test-run/" +
          params.testRunId,
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
              gap: "100px",
              paddingTop: "10px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography sx={{ marginTop: "10px" }} variant="h6">
                {testRun?.runName}
              </Typography>
              <Timings testRun={testRun} />
              {/*<Typography sx={{marginTop: "10px"}} variant="h6">Tests count: {testRun?.testsCount}</Typography>*/}
              {/*<TestsInfo testRun={testRun}/>*/}
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
