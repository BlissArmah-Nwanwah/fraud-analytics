import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Series = { name: string; data: number[] }[];

const HorizontalBarChart: React.FC<{
  categories: string[];
  series: Series;
}> = ({ categories, series }) => {
  const options: ApexOptions = {
    chart: { type: "bar", stacked: false, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: { categories },
    colors: ["#8b5cf6", "#22c55e"],
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val) => `${val}` } },
  };
  return <Chart options={options} series={series} type="bar" height={300} />;
};

export default HorizontalBarChart;
