import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { TestRun } from "@/client";
import Link from "next/link";
import { green, red, yellow } from "@mui/material/colors";
import { RowStatus } from "@/components/RowStatus";
import { formatDuration } from "@/tools/format-duration";

interface TestRunRowProps {
  testRun: TestRun;
}

dayjs.extend(relativeTime);
dayjs.extend(duration);

function LinearProgressWithLabel(
  props: LinearProgressProps & {
    value: number;
    failed: number;
    pluginType: string;
  },
) {
  return (
    <LinearProgress
      color={props.failed === 0 ? "primary" : "inherit"}
      variant={props.pluginType === "pytest.xml" ? undefined : "determinate"}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        color: props.failed > 0 ? red[500] : "",
        height: props.pluginType === "pytest.xml" ? "2px" : "5px",
      }}
      {...props}
    />
  );
}

export const TestRunRow = ({ testRun }: TestRunRowProps) => {
  const { stoppedAt, startedAt, testsCount, passed, failed, skipped } = testRun;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalProcessed =
      ((passed as number) || 0) +
      ((failed as number) || 0) +
      ((skipped as number) || 0);
    const percentageProgress = (totalProcessed / (testsCount as number)) * 100;
    setProgress(percentageProgress.toFixed(2) as unknown as number); // TODO
  }, [testRun, passed, failed, skipped, testsCount]);

  const envName = "";

  return (
    <Link
      href={
        testRun.pluginType === "pytest.xml" && !testRun.stoppedAt
          ? ""
          : `/test-runs/${testRun.uuid}`
      }
    >
      <Card variant="outlined">
        <Box sx={{ position: "relative" }}>
          {!stoppedAt && (
            <LinearProgressWithLabel
              pluginType={testRun.pluginType}
              value={progress}
              failed={testRun.failed ? (testRun.failed as number) : 0}
            />
          )}
        </Box>

        <Box sx={{ display: "flex" }}>
          {stoppedAt && <RowStatus item={testRun} />}
          <Box sx={{ display: "flex" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: "50px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      verticalAlign: "center",
                    }}
                  >
                    {envName ? (
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        possible name tag
                      </Typography>
                    ) : (
                      <Typography sx={{}} color="text.secondary">
                        {testRun.pluginType !== "pytest.xml"
                          ? testsCount !== undefined
                            ? `${testsCount} tests`
                            : `0 tests`
                          : testsCount !== undefined
                            ? `${testsCount} tests`
                            : `waiting for xml report`}
                      </Typography>
                    )}
                    <Typography variant="h5">{testRun.runName}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      verticalAlign: "center",
                    }}
                  >
                    {envName ? (
                      <Typography sx={{}} color="text.secondary">
                        {testsCount !== undefined ? testsCount : "0"} tests
                      </Typography>
                    ) : (
                      <Typography>&nbsp;</Typography>
                    )}
                    {testRun.pluginType === "pytest.xml" &&
                    !testRun.stoppedAt ? (
                      <></>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          paddingTop: "5px",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
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
                            <Typography color={green[500]}>
                              PASSED:{" "}
                              {testRun.passed ? (testRun.passed as number) : 0}
                            </Typography>
                          </Paper>
                        </Box>
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
                            <Typography color={red[500]}>
                              FAILED:{" "}
                              {testRun.failed ? (testRun.failed as number) : 0}
                            </Typography>
                          </Paper>
                        </Box>
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
                            <Typography color={yellow[800]}>
                              SKIPPED:{" "}
                              {testRun.skipped
                                ? (testRun.skipped as number)
                                : 0}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      verticalAlign: "center",
                    }}
                  >
                    <Box>&nbsp;</Box>
                    <Box
                      sx={{
                        display: "flex",
                        paddingTop: "5px",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <Typography sx={{}} color="text.secondary">
                        {stoppedAt
                          ? `Ended: ${dayjs(testRun.stoppedAt as string).fromNow()}`
                          : `Started ${dayjs(startedAt as string).fromNow()}`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      verticalAlign: "center",
                    }}
                  >
                    <Box>&nbsp;</Box>
                    <Box
                      sx={{
                        display: "flex",
                        paddingTop: "5px",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <Typography sx={{}} color="text.secondary">
                        Duration:{" "}
                        {formatDuration(
                          startedAt as string,
                          stoppedAt as string,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row" }}></Box>
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};
