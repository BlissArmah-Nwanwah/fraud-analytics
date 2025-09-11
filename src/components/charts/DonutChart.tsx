import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const DonutChart: React.FC<{ labels: string[]; values: number[] }> = ({
  labels,
  values,
}) => {
  const options: ApexOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels,
    colors: ["#8b5cf6", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4", "#10b981"],
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    stroke: { show: false },
  };
  const series = values;
  return <Chart options={options} series={series} type="donut" height={300} />;
};

export default DonutChart;
