import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type ActivityPoint = {
  date: string;
  totalAnalyses: number;
  fraudDetected: number;
  userScans: number;
  backgroundScans: number;
};

const TimeSeriesChart: React.FC<{ data: ActivityPoint[] }> = ({ data }) => {
  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: {
      type: "datetime",
      categories: data.map((d) => d.date),
    },
    colors: ["#8b5cf6", "#ef4444", "#22c55e", "#06b6d4"],
    stroke: { width: 2, curve: "smooth" },
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
  };
  const series = [
    { name: "Total Analyses", data: data.map((d) => d.totalAnalyses) },
    { name: "Fraud Detected", data: data.map((d) => d.fraudDetected) },
    { name: "User Scans", data: data.map((d) => d.userScans) },
    { name: "Background Scans", data: data.map((d) => d.backgroundScans) },
  ];
  return <Chart options={options} series={series} type="line" height={300} />;
};

export default TimeSeriesChart;
