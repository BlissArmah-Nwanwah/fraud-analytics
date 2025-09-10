import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useKpisQuery, useTimeSeriesQuery } from "@/api/dashboardApi";
import {
  useGetOverviewStatsQuery,
  useGetActivityStatsQuery,
  useGetRiskFactorsQuery,
} from "@/api/fraudDetectionApi";
import type { RootState } from "@/app/rootReducer";
import { Skeleton } from "@/components/ui/skeleton";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import BarCompareChart from "@/components/charts/BarCompareChart";
import { formatPercent } from "@/utils/formatters";

const Kpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{label}</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-purple-700 dark:text-purple-300">
      {value}
    </CardContent>
  </Card>
);

const Overview: React.FC = () => {
  const { dateRange, region, provider, days } = useSelector(
    (s: RootState) => s.filters
  );
  const { data: kpis, isLoading: kLoading } = useKpisQuery({
    from: dateRange.from,
    to: dateRange.to,
    region,
    provider,
  });
  const { data: overview, isLoading: oLoading } = useGetOverviewStatsQuery({
    days,
  });
  useTimeSeriesQuery({
    from: dateRange.from,
    to: dateRange.to,
    region,
    provider,
  });
  const { data: activity, isLoading: aLoading } = useGetActivityStatsQuery({
    days,
  });
  const { data: risks, isLoading: rLoading } = useGetRiskFactorsQuery({ days });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kLoading || oLoading || !kpis || !overview ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (
          <>
            <Kpi
              label="Total Analyses"
              value={overview.totalAnalyses.toLocaleString()}
            />
            <Kpi
              label="Fraud Detected"
              value={overview.fraudDetected.toLocaleString()}
            />
            <Kpi label="Fraud Rate" value={formatPercent(overview.fraudRate)} />
            <Kpi
              label="User Scans"
              value={overview.userScanCount.toLocaleString()}
            />
            <Kpi
              label="Background Scans"
              value={overview.backgroundScanCount.toLocaleString()}
            />
            <Kpi
              label="Text Analyses"
              value={overview.textAnalysisCount.toLocaleString()}
            />
            <Kpi
              label="Image Analyses"
              value={overview.imageAnalysisCount.toLocaleString()}
            />
            <Kpi
              label="Avg Confidence"
              value={formatPercent(overview.averageConfidence)}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Series</CardTitle>
        </CardHeader>
        <CardContent>
          {aLoading || !activity ? (
            <Skeleton className="h-80" />
          ) : (
            <TimeSeriesChart data={activity} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          {rLoading || !risks ? (
            <Skeleton className="h-80" />
          ) : (
            <BarCompareChart
              categories={risks.categories}
              series={[{ name: "Occurrences", data: risks.counts }]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confidence Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {rLoading || !risks ? (
            <Skeleton className="h-80" />
          ) : (
            <BarCompareChart
              categories={risks.confidence.map((c) => c.range)}
              series={[
                { name: "Count", data: risks.confidence.map((c) => c.count) },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
