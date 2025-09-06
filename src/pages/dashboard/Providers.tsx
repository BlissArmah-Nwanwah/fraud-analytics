import React from "react";
import { useProvidersQuery } from "@/api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const Providers: React.FC = () => {
  const { data } = useProvidersQuery();
  const categories = (data || []).map((d) => d.provider);
  const fraudSeries = [{ name: "Fraud Rate %", data: (data || []).map((d) => d.fraudRate) }];
  const latencySeries = [{ name: "Latency (ms)", data: (data || []).map((d) => d.latency) }];

  const barOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories },
    colors: ["#8b5cf6"],
  };

  const lineOptions: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories },
    colors: ["#22c55e"],
    stroke: { curve: "smooth", width: 2 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Fraud Rate by Provider</CardTitle></CardHeader>
        <CardContent>
          <Chart options={barOptions} series={fraudSeries} type="bar" height={320} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Latency by Provider</CardTitle></CardHeader>
        <CardContent>
          <Chart options={lineOptions} series={latencySeries} type="line" height={320} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Providers;
