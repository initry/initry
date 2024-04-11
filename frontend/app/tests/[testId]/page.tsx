"use client";
import React, { useEffect, useState } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TestRunsApi } from "@/client/api/test-runs-api";
import { TestRun, Testrunuuid, TestsApi } from "@/client";
import { Test } from "@/client";
import { Loading } from "@/components/Loading/Loading";
import { TestStatus } from "@/components/Test/Status";
import Link from "next/link";
import { FrameworkLogo } from "@/components/TestRun/FrameworkLogo";
import { TestHistoryRow } from "@/components/TestHistoryRow";
import { RunningTestInfo } from "@/components/TestRun/RunningTestInfo";
import { TestRunStatus } from "@/components/TestRun/Status";
import { Timings } from "@/components/TestRun/Timings";
import { StatusChart } from "@/components/TestRun/StatusChart";
import { TestRow } from "@/components/TestRow";

const getTestById = (testRunId: string) => {
  return new TestsApi().getTestById(testRunId);
};

const getTestRunById = (testRunId?: Testrunuuid) => {
  return new TestRunsApi().getTestRunById(testRunId);
};

const getTestHistoryByTestId = (testId: string) => {
  return new TestsApi().getHistoryByTestId(testId);
};

const TestPage = ({ params }: { params: { testId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test>({
    description: undefined,
    location: undefined,
    nodeid: undefined,
    startedAt: undefined,
    status: "",
    stoppedAt: undefined,
    testRunUuid: undefined,
    uuid: "",
  });
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
  const [testHistory, setTestHistory] = useState<Test[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testResponse = await getTestById(params.testId);
        setTest(testResponse.data);
        setLoading(false);

        const testRunResponse = await getTestRunById(
          testResponse?.data.testRunUuid,
        );
        setTestRun(testRunResponse.data);
        setLoading(false);

        const testHistoryResponse = await getTestHistoryByTestId(params.testId);
        setTestHistory(testHistoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.testId]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <TestStatus test={test} testRun={testRun} />
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
                <Link href={`/test-runs/${testRun?.uuid}`}>
                  {testRun?.runName}
                </Link>
              </Typography>
              <Timings testRun={testRun} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography sx={{ marginTop: "10px" }} variant="h6">
                History (last 20 executions):
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Paper elevation={0} sx={{ width: "70vw" }}>
                  {testHistory &&
                    testHistory.map((t, idx) => (
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
                        {idx < testHistory.length - 1 && (
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
export default TestPage;
