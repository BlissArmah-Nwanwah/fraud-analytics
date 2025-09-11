import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActivityStatsQuery } from "@/api/fraudDetectionApi";
import type { RootState } from "@/app/rootReducer";
import { setDays } from "@/app/slices/filtersSlice";

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const days = useSelector((s: RootState) => s.filters.days);
  const { data, isLoading, isError } = useGetActivityStatsQuery({ days });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daily Activity</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Range</span>
          <Select
            value={String(days)}
            onValueChange={(v) => dispatch(setDays(parseInt(v, 10)))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity by Day</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : isError || !data ? (
            <div className="text-sm text-red-600">Failed to load activity.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-right p-2 font-medium">Total Analyses</th>
                    <th className="text-right p-2 font-medium">Fraud Detected</th>
                    <th className="text-right p-2 font-medium">User Scans</th>
                    <th className="text-right p-2 font-medium">Background Scans</th>
                    <th className="text-right p-2 font-medium">Fraud Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .slice()
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((row) => {
                      const rate = row.totalAnalyses
                        ? (row.fraudDetected / row.totalAnalyses) * 100
                        : 0;
                      return (
                        <tr
                          key={row.date}
                          className="border-b border-gray-100 dark:border-white/5"
                        >
                          <td className="p-2">{row.date}</td>
                          <td className="p-2 text-right">{row.totalAnalyses}</td>
                          <td className="p-2 text-right">{row.fraudDetected}</td>
                          <td className="p-2 text-right">{row.userScans}</td>
                          <td className="p-2 text-right">{row.backgroundScans}</td>
                          <td className="p-2 text-right">
                            {rate.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;
