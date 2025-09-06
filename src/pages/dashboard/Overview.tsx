import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useKpisQuery, useTimeSeriesQuery } from "@/api/dashboardApi";
import type { RootState } from "@/app/rootReducer";
import { Skeleton } from "@/components/ui/skeleton";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import BarCompareChart from "@/components/charts/BarCompareChart";
import { formatCurrency, formatPercent } from "@/utils/formatters";

const Kpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{label}</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-purple-700 dark:text-purple-300">{value}</CardContent>
  </Card>
);

const Overview: React.FC = () => {
  const { dateRange, region, provider } = useSelector((s: RootState) => s.filters);
  const { data: kpis, isLoading: kLoading } = useKpisQuery({ from: dateRange.from, to: dateRange.to, region, provider });
  const { data: series, isLoading: sLoading } = useTimeSeriesQuery({ from: dateRange.from, to: dateRange.to, region, provider });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kLoading || !kpis ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <Kpi label="Transactions" value={kpis.transactions.toLocaleString()} />
            <Kpi label="Flagged" value={kpis.flagged.toLocaleString()} />
            <Kpi label="Confirmed Fraud" value={kpis.confirmedFraud.toLocaleString()} />
            <Kpi label="Precision" value={formatPercent(kpis.precision)} />
            <Kpi label="Recall" value={formatPercent(kpis.recall)} />
            <Kpi label="Losses" value={formatCurrency(kpis.losses)} />
            <Kpi label="Net Reduction" value={formatCurrency(kpis.netReduction)} />
            <Kpi label="Flagged Rate" value={formatPercent((kpis.flagged / Math.max(1, kpis.transactions)) * 100)} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Series</CardTitle>
        </CardHeader>
        <CardContent>
          {sLoading || !series ? (
            <Skeleton className="h-80" />
          ) : (
            <TimeSeriesChart data={series} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparative</CardTitle>
        </CardHeader>
        <CardContent>
          {sLoading || !series ? (
            <Skeleton className="h-80" />
          ) : (
            <BarCompareChart
              categories={series.map((d) => d.x)}
              series={[
                { name: "Transactions", data: series.map((d) => d.transactions) },
                { name: "Fraud", data: series.map((d) => d.fraud) },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;

