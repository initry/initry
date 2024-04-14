"use client";
import React, { useEffect, useState } from "react";
import { Divider, IconButton, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TestRunsApi } from "@/client/api/test-runs-api";
import { TestRun, Testrunuuid, TestsApi } from "@/client";
import { Test } from "@/client";
import { Loading } from "@/components/Loading/Loading";
import { TestStatus } from "@/components/Test/Status";
import Link from "next/link";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Timings } from "@/components/TestRun/Timings";
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

const LogBlock = (
  log: string,
  title: string,
  handleCopy: (value: string) => void,
) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6">{title}</Typography>
      <Box
        sx={{
          position: "relative",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          my: 2,
          p: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#101010" : "grey.100",
          color: (theme) =>
            theme.palette.mode === "dark" ? "grey.300" : "grey.800",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.300",
          borderRadius: 1,
          fontSize: "0.875rem",
        }}
      >
        {log}
        <IconButton
          aria-label="Copy"
          onClick={() => handleCopy(log)}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "grey.600",
            opacity: "50%",
          }}
        >
          <FileCopyIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const TestPage = ({ params }: { params: { testId: string } }) => {
  const [_copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test>({
    description: undefined,
    location: undefined,
    log: undefined,
    nodeid: undefined,
    startedAt: undefined,
    status: undefined,
    stderr: undefined,
    stdout: undefined,
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

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset copied status after 1.5 seconds
  };

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
              {test.log || test.stdout || test.stderr ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {test.log &&
                      LogBlock(test.log as string, "Log", handleCopy)}
                    {test.stdout &&
                      LogBlock(test.stdout as string, "stdout", handleCopy)}
                    {test.stderr &&
                      LogBlock(test.stderr as string, "stderr", handleCopy)}
                  </Box>
                </>
              ) : (
                ""
              )}
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
