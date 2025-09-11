import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useKpisQuery, useTimeSeriesQuery } from "@/api/dashboardApi";
import {
  useGetOverviewStatsQuery,
  useGetAdminOverviewStatsQuery,
  useGetAdminActivityStatsQuery,
  useGetActivityStatsQuery,
  useGetRiskFactorsQuery,
  useGetAdminRiskFactorsQuery,
} from "@/api/fraudDetectionApi";
import type { RootState } from "@/app/rootReducer";
import { Skeleton } from "@/components/ui/skeleton";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import DonutChart from "@/components/charts/DonutChart";
import { formatPercent, formatMillisecondsAsSeconds } from "@/utils/formatters";
import Kpi from "@/components/dashboard/Kpi";

const Overview: React.FC = () => {
  const { dateRange, region, provider, days } = useSelector(
    (s: RootState) => s.filters
  );
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === "admin";

  const { isLoading: kLoading } = useKpisQuery({
    from: dateRange.from,
    to: dateRange.to,
    region,
    provider,
  });
  const { data: overview, isLoading: oLoading } = useGetOverviewStatsQuery(
    { days },
    { skip: isAdmin }
  );
  const { data: adminOverview, isLoading: aLoading } =
    useGetAdminOverviewStatsQuery({ days }, { skip: !isAdmin });
  useTimeSeriesQuery({
    from: dateRange.from,
    to: dateRange.to,
    region,
    provider,
  });
  const { data: userActivity, isLoading: userActLoading } =
    useGetActivityStatsQuery({ days }, { skip: isAdmin });
  const { data: adminActivity, isLoading: adminActLoading } =
    useGetAdminActivityStatsQuery({ days }, { skip: !isAdmin });
  const activity = isAdmin ? adminActivity : userActivity;
  const actLoading = isAdmin ? adminActLoading : userActLoading;

  const { data: userRisks, isLoading: userRLoading } = useGetRiskFactorsQuery(
    { days },
    { skip: isAdmin }
  );
  const { data: adminRisks, isLoading: adminRLoading } =
    useGetAdminRiskFactorsQuery({ days }, { skip: !isAdmin });
  const risks = isAdmin ? adminRisks : userRisks;
  const rLoading = isAdmin ? adminRLoading : userRLoading;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kLoading ||
        oLoading ||
        aLoading ||
        (!isAdmin && !overview) ||
        (isAdmin && !adminOverview) ? (
          Array.from({ length: isAdmin ? 6 : 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : isAdmin ? (
          <>
            <Kpi
              label="Total Analyses"
              value={adminOverview!.totalAnalyses.toLocaleString()}
            />
            <Kpi
              label="Total Users"
              value={adminOverview!.totalUsers.toLocaleString()}
            />
            <Kpi
              label="Fraud Detected"
              value={adminOverview!.fraudDetected.toLocaleString()}
            />
            <Kpi
              label="Fraud Rate"
              value={formatPercent(adminOverview!.fraudRate)}
            />
            <Kpi
              label="Avg Processing Time"
              value={formatMillisecondsAsSeconds(
                adminOverview!.averageProcessingTime
              )}
            />
            <Kpi
              label="User Scans"
              value={adminOverview!.sourceBreakdown.userScan.toLocaleString()}
            />
          </>
        ) : (
          <>
            <Kpi
              label="Total Analyses"
              value={overview!.totalAnalyses.toLocaleString()}
            />
            <Kpi
              label="Fraud Detected"
              value={overview!.fraudDetected.toLocaleString()}
            />
            <Kpi
              label="Fraud Rate"
              value={formatPercent(overview!.fraudRate)}
            />
            <Kpi
              label="User Scans"
              value={overview!.userScanCount.toLocaleString()}
            />
            <Kpi
              label="Background Scans"
              value={overview!.backgroundScanCount.toLocaleString()}
            />
            <Kpi
              label="Text Analyses"
              value={overview!.textAnalysisCount.toLocaleString()}
            />
            <Kpi
              label="Image Analyses"
              value={overview!.imageAnalysisCount.toLocaleString()}
            />
            <Kpi
              label="Avg Confidence"
              value={formatPercent(overview!.averageConfidence)}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {actLoading || !activity ? (
            <Skeleton className="h-80" />
          ) : (
            <TimeSeriesChart data={activity} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            {rLoading || !risks ? (
              <Skeleton className="h-80" />
            ) : (
              <HorizontalBarChart
                categories={risks.categories}
                series={[{ name: "Occurrences", data: risks.counts }]}
              />
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {rLoading || !risks ? (
              <Skeleton className="h-80" />
            ) : (
              <DonutChart
                labels={risks.confidence.map((c) => c.range)}
                values={risks.confidence.map((c) => c.count)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
