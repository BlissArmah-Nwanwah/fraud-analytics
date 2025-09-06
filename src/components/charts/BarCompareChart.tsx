import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const BarCompareChart: React.FC<{ categories: string[]; series: { name: string; data: number[] }[] }> = ({ categories, series }) => {
  const options: ApexOptions = {
    chart: { type: "bar", stacked: false, toolbar: { show: false } },
    xaxis: { categories },
    colors: ["#8b5cf6", "#22c55e"],
    theme: { mode: document.documentElement.classList.contains("dark") ? "dark" : "light" },
  };
  return <Chart options={options} series={series} type="bar" height={300} />;
};

export default BarCompareChart;
