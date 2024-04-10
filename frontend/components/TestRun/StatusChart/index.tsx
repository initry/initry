import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { TestRun } from "@/client";
import { green, red, yellow } from "@mui/material/colors";
import Box from "@mui/material/Box";

interface PropsInterface {
  testRun: TestRun;
}

export const StatusChart = (props: PropsInterface) => {
  const { testRun } = props;
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!testRun || !chartRef.current) return;

    const getChartInstance = () => {
      const ctx = chartRef.current
        ? chartRef.current.getContext("2d")
        : undefined;
      if (ctx) {
        return new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Passed", "Failed", "Skipped"],
            datasets: [
              {
                label: "Passed",
                data: [testRun.passed, testRun.failed, testRun.skipped] || [],
                backgroundColor: [green[600], red[600], yellow[600]],
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            animation: {
              duration: 0,
            },
            responsive: true,
          },
        });
      }
    };

    const chartInstance = getChartInstance();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [testRun]);

  return (
    <Box>
      <canvas width="100%" height="100%" ref={chartRef} />
    </Box>
  );
};
