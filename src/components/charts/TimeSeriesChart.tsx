import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const TimeSeriesChart: React.FC<{ data: { x: string; transactions: number; fraud: number }[] }> = ({ data }) => {
  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories: data.map((d) => d.x) },
    colors: ["#8b5cf6", "#ef4444"],
    stroke: { width: 2, curve: "smooth" },
    theme: { mode: document.documentElement.classList.contains("dark") ? "dark" : "light" },
  };
  const series = [
    { name: "Transactions", data: data.map((d) => d.transactions) },
    { name: "Fraud", data: data.map((d) => d.fraud) },
  ];
  return <Chart options={options} series={series} type="line" height={300} />;
};

export default TimeSeriesChart;
