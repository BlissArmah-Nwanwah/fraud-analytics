import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/config/env";

export interface FraudOverviewStats {
  totalAnalyses: number;
  fraudDetected: number;
  fraudRate: number;
  userScanCount: number;
  backgroundScanCount: number;
  textAnalysisCount: number;
  imageAnalysisCount: number;
  averageConfidence: number;
  lastAnalysisAt: string | null;
}

export interface AdminOverviewStats {
  totalAnalyses: number;
  totalUsers: number;
  fraudDetected: number;
  fraudRate: number;
  averageProcessingTime: number;
  sourceBreakdown: {
    userScan: number;
    backgroundScan: number;
  };
  typeBreakdown: {
    text: number;
    image: number;
  };
}

export interface FraudOverviewResponse {
  message: string;
  data: FraudOverviewStats;
}

export interface AdminOverviewResponse {
  message: string;
  data: AdminOverviewStats;
}

export interface ActivityPoint {
  date: string;
  totalAnalyses: number;
  fraudDetected: number;
  userScans: number;
  backgroundScans: number;
}

export interface ActivityApiResponse {
  message: string;
  data: {
    dailyActivity: Array<{
      date: string;
      totalAnalyses: number;
      fraudDetected: number;
      userScans: number;
      backgroundScans: number;
    }>;
    sourceBreakdown: { userScan: number; backgroundScan: number };
    typeBreakdown: { text: number; image: number };
  };
}

export interface RiskFactorsApiResponse {
  message: string;
  data: {
    topRiskFactors: Array<{ factor: string; count: number }>;
    confidenceDistribution: Array<{ range: string; count: number }>;
  };
}

export interface AdminActivityApiResponse {
  message: string;
  data: {
    timeSeriesData: Array<{
      date: string;
      totalAnalyses: number;
      fraudDetected: number;
      userScans: number;
      backgroundScans: number;
    }>;
  };
}

export interface AdminRiskFactorsApiResponse {
  message: string;
  data: {
    topRiskFactors: Array<{
      factor: string;
      count: number;
      fraudPercentage?: number;
    }>;
    confidenceDistribution: Array<{ range: string; count: number }>;
  };
}

export interface AdminRegionsApiResponse {
  message: string;
  data: {
    regionBreakdown: Array<{
      region: string;
      count: number;
      fraudCount: number;
      fraudRate: number;
    }>;
  };
}

export const fraudDetectionApi = createApi({
  reducerPath: "fraudDetectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOverviewStats: builder.query<FraudOverviewStats, { days?: number }>({
      query: ({ days = 30 } = {}) => ({
        url: "api/fraud-detection/stats/overview",
        params: { days },
      }),
      transformResponse: (response: FraudOverviewResponse) => response.data,
    }),
    getAdminOverviewStats: builder.query<AdminOverviewStats, { days?: number }>(
      {
        query: ({ days = 30 } = {}) => ({
          url: "api/fraud-detection/admin/overview",
          params: { days },
        }),
        transformResponse: (response: AdminOverviewResponse) => response.data,
      }
    ),
    getActivityStats: builder.query<ActivityPoint[], { days?: number }>({
      query: ({ days = 7 } = {}) => ({
        url: "api/fraud-detection/stats/activity",
        params: { days },
      }),
      transformResponse: (response: ActivityApiResponse): ActivityPoint[] =>
        response.data.dailyActivity.map((d) => ({
          date: d.date,
          totalAnalyses: d.totalAnalyses,
          fraudDetected: d.fraudDetected,
          userScans: d.userScans,
          backgroundScans: d.backgroundScans,
        })),
    }),
    getRiskFactors: builder.query<
      {
        categories: string[];
        counts: number[];
        confidence: { range: string; count: number }[];
      },
      { days?: number }
    >({
      query: ({ days = 7 } = {}) => ({
        url: "api/fraud-detection/stats/risk-factors",
        params: { days },
      }),
      transformResponse: (response: RiskFactorsApiResponse) => {
        const categories = response.data.topRiskFactors.map((r) => r.factor);
        const counts = response.data.topRiskFactors.map((r) => r.count);
        return {
          categories,
          counts,
          confidence: response.data.confidenceDistribution,
        };
      },
    }),
    getAdminActivityStats: builder.query<ActivityPoint[], { days?: number }>({
      query: ({ days = 7 } = {}) => ({
        url: "api/fraud-detection/admin/activity",
        params: { days },
      }),
      transformResponse: (
        response: AdminActivityApiResponse
      ): ActivityPoint[] =>
        response.data.timeSeriesData.map((d) => ({
          date: d.date,
          totalAnalyses: d.totalAnalyses,
          fraudDetected: d.fraudDetected,
          userScans: d.userScans,
          backgroundScans: d.backgroundScans,
        })),
    }),
    getAdminRiskFactors: builder.query<
      {
        categories: string[];
        counts: number[];
        fraudPercentages?: number[];
        confidence: { range: string; count: number }[];
      },
      { days?: number }
    >({
      query: ({ days = 7 } = {}) => ({
        url: "api/fraud-detection/admin/risk-factors",
        params: { days },
      }),
      transformResponse: (response: AdminRiskFactorsApiResponse) => {
        const categories = response.data.topRiskFactors.map((r) => r.factor);
        const counts = response.data.topRiskFactors.map((r) => r.count);
        const fraudPercentages = response.data.topRiskFactors.map(
          (r) => r.fraudPercentage ?? 0
        );
        return {
          categories,
          counts,
          fraudPercentages,
          confidence: response.data.confidenceDistribution,
        };
      },
    }),
    getAdminRegionsStats: builder.query<
      {
        categories: string[];
        counts: number[];
        fraudCounts: number[];
        fraudRates: number[];
      },
      { days?: number }
    >({
      query: ({ days = 30 } = {}) => ({
        url: "api/fraud-detection/admin/regions",
        params: { days },
      }),
      transformResponse: (response: AdminRegionsApiResponse) => {
        const categories = response.data.regionBreakdown.map((r) => r.region);
        const counts = response.data.regionBreakdown.map((r) => r.count);
        const fraudCounts = response.data.regionBreakdown.map(
          (r) => r.fraudCount
        );
        const fraudRates = response.data.regionBreakdown.map(
          (r) => r.fraudRate
        );
        return { categories, counts, fraudCounts, fraudRates };
      },
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetAdminOverviewStatsQuery,
  useGetAdminActivityStatsQuery,
  useGetActivityStatsQuery,
  useGetRiskFactorsQuery,
  useGetAdminRiskFactorsQuery,
  useGetAdminRegionsStatsQuery,
} = fraudDetectionApi;
