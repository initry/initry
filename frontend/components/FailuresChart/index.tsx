import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import { TestRunsTrend } from "@/client/models";
import { red } from "@mui/material/colors";

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

export const FailuresChart = (props: PropsInterface) => {
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
          type: "line",
          data: {
            labels: generateLast7DaysLabels(),
            datasets: [
              {
                label: "Failed",
                data: testRunsDataByDay.failed || [],
                borderColor: red[500],
                backgroundColor: red[500] + "50",
                fill: false,
                cubicInterpolationMode: "monotone",
                pointStyle: "circle",
                pointRadius: 6,
                pointHoverRadius: 8,
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            plugins: {
              legend: false as unknown as never,
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
