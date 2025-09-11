import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/rootReducer";
import { useGetAdminRegionsStatsQuery } from "@/api/fraudDetectionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const Geography: React.FC = () => {
  const { days } = useSelector((s: RootState) => s.filters);
  const { data } = useGetAdminRegionsStatsQuery({ days });

  const categories = data?.categories ?? [];
  const series = [
    { name: "Total", data: data?.counts ?? [] },
    { name: "Fraud", data: data?.fraudCounts ?? [] },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          if (typeof config.dataPointIndex === "number") {
            setSelectedRegionIdx(config.dataPointIndex);
          }
        },
      },
    },
    xaxis: { categories },
    colors: ["#8b5cf6", "#ef4444"],
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
    legend: { position: "bottom" },
  };

  const [selectedRegionIdx, setSelectedRegionIdx] = React.useState(0);
  const clampedIdx = Math.min(
    Math.max(0, selectedRegionIdx),
    Math.max(0, categories.length - 1)
  );
  const regionLabel = categories[clampedIdx] ?? "";
  const fraudRate = data?.fraudRates?.[clampedIdx] ?? 0;
  const pieLabels = ["Fraud %", "Non-fraud %"];
  const pieValues = [fraudRate, Math.max(0, 100 - fraudRate)];
  const pieOptions: ApexOptions = {
    chart: { type: "pie", toolbar: { show: false } },
    labels: pieLabels,
    colors: ["#ef4444", "#10b981"],
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Regional Breakdown (Total vs Fraud)</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart options={options} series={series} type="bar" height={420} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{regionLabel || "Fraud Rate"}</CardTitle>
            <select
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#0b0b0f]"
              aria-label="Select region"
              value={clampedIdx}
              onChange={(e) => setSelectedRegionIdx(Number(e.target.value))}
            >
              {categories.map((c, i) => (
                <option key={c} value={i}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Chart
            options={pieOptions}
            series={pieValues}
            type="pie"
            height={420}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Geography;
