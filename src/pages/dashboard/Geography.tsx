import React from "react";
import { useGeographyHeatQuery } from "@/api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const Geography: React.FC = () => {
  const { data } = useGeographyHeatQuery();
  const series = (data || []).map((r) => ({ name: r.region, data: r.districts.map((d) => d.value) }));
  const categories = (data?.[0]?.districts || []).map((d) => d.name);
  const options: ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    plotOptions: { heatmap: { shadeIntensity: 0.5, colorScale: { ranges: [{ from: 0, to: 3, color: "#ede9fe" }, { from: 4, to: 8, color: "#c4b5fd" }, { from: 9, to: 100, color: "#8b5cf6" }] } } },
    xaxis: { categories },
    dataLabels: { enabled: false },
    theme: { mode: document.documentElement.classList.contains("dark") ? "dark" : "light" },
  };
  return (
    <Card>
      <CardHeader><CardTitle>Ghana Regions Heatmap (Drilldown by Districts)</CardTitle></CardHeader>
      <CardContent>
        <Chart options={options} series={series} type="heatmap" height={420} />
      </CardContent>
    </Card>
  );
};

export default Geography;
