import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import { TestRunsTrend } from "@/client/models";
import { green, red, yellow } from "@mui/material/colors";

const generateLast7DaysLabels = () => {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, "day").format("MMM D");
    labels.push(date);
  }
  return labels;
};

interface PropsInterface {
  testRunsDataByDay: TestRunsTrend;
}

export const TrendBarChart = (props: PropsInterface) => {
  const { testRunsDataByDay } = props;
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!testRunsDataByDay || !chartRef.current) return;

    const getChartInstance = () => {
      const ctx = chartRef.current
        ? chartRef.current.getContext("2d")
        : undefined;
      if (ctx) {
        return new Chart(ctx, {
          type: "bar",
          data: {
            labels: generateLast7DaysLabels(),
            datasets: [
              {
                label: "Passed",
                data: testRunsDataByDay.passed || [],
                backgroundColor: green[600],
              },
              {
                label: "Failed",
                data: testRunsDataByDay.failed || [],
                backgroundColor: red[600],
              },
              {
                label: "Skipped",
                data: testRunsDataByDay.skipped || [],
                backgroundColor: yellow[600],
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
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
  }, [testRunsDataByDay]);

  return <canvas height="40vh" width="80vw" ref={chartRef} />;
};
