import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type TxType = "credit_card" | "bank_transfer" | "online_payment";
type TxStatus = "flagged" | "confirmed_fraud" | "legit";

export interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  type: TxType;
  status: TxStatus;
  provider: string; // e.g., MTN, Vodafone, AirtelTigo
  region: string; // Ghana regions
  latencyMs: number;
}

// Dummy dataset generator
const providers = ["MTN", "Vodafone", "AirtelTigo", "Zeepay"];
const regions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Northern",
  "Volta",
  "Central",
  "Bono East",
];

const randomChoice = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const txData: Transaction[] = Array.from({ length: 300 }).map((_, i) => {
  const amount = Math.round(Math.random() * 5000 * 100) / 100;
  const statusRand = Math.random();
  const status: TxStatus =
    statusRand < 0.1
      ? "confirmed_fraud"
      : statusRand < 0.25
      ? "flagged"
      : "legit";
  const timestamp = new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
  ).toISOString();
  return {
    id: `tx_${i + 1}`,
    amount,
    timestamp,
    type: randomChoice(["credit_card", "bank_transfer", "online_payment"]),
    status,
    provider: randomChoice(providers),
    region: randomChoice(regions),
    latencyMs: Math.round(50 + Math.random() * 450),
  };
});

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    kpis: builder.query<
      {
        transactions: number;
        flagged: number;
        confirmedFraud: number;
        precision: number;
        recall: number;
        losses: number;
        netReduction: number;
      },
      {
        from?: string | null;
        to?: string | null;
        region?: string | null;
        provider?: string | null;
      }
    >({
      async queryFn(args) {
        const { from, to, region, provider } = args || {};
        const filtered = txData.filter((t) => {
          const timeOk =
            (!from || new Date(t.timestamp) >= new Date(from)) &&
            (!to || new Date(t.timestamp) <= new Date(to));
          const regionOk = !region || t.region === region;
          const providerOk = !provider || t.provider === provider;
          return timeOk && regionOk && providerOk;
        });
        const transactions = filtered.length;
        const flagged = filtered.filter((t) => t.status === "flagged").length;
        const confirmedFraud = filtered.filter(
          (t) => t.status === "confirmed_fraud"
        ).length;
        // Mock precision/recall using simple heuristics
        const precision = flagged
          ? Math.round(
              ((confirmedFraud / flagged) * 100 + Number.EPSILON) * 10
            ) / 10
          : 0;
        const recall = transactions
          ? Math.round(
              ((confirmedFraud / transactions) * 100 + Number.EPSILON) * 10
            ) / 10
          : 0;
        const losses = Math.round(
          filtered
            .filter((t) => t.status === "confirmed_fraud")
            .reduce((a, b) => a + b.amount, 0)
        );
        const netReduction = Math.round(losses * 0.4);
        return {
          data: {
            transactions,
            flagged,
            confirmedFraud,
            precision,
            recall,
            losses,
            netReduction,
          },
        };
      },
    }),
    timeSeries: builder.query<
      { x: string; transactions: number; fraud: number }[],
      {
        from?: string | null;
        to?: string | null;
        region?: string | null;
        provider?: string | null;
      }
    >({
      async queryFn(args) {
        const { from, to, region, provider } = args || {};
        const filtered = txData.filter((t) => {
          const timeOk =
            (!from || new Date(t.timestamp) >= new Date(from)) &&
            (!to || new Date(t.timestamp) <= new Date(to));
          const regionOk = !region || t.region === region;
          const providerOk = !provider || t.provider === provider;
          return timeOk && regionOk && providerOk;
        });
        const byDay = new Map<
          string,
          { transactions: number; fraud: number }
        >();
        for (const t of filtered) {
          const day = new Date(t.timestamp).toISOString().slice(0, 10);
          if (!byDay.has(day)) byDay.set(day, { transactions: 0, fraud: 0 });
          const entry = byDay.get(day)!;
          entry.transactions += 1;
          if (t.status === "confirmed_fraud") entry.fraud += 1;
        }
        const data = Array.from(byDay.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([x, v]) => ({
            x,
            transactions: v.transactions,
            fraud: v.fraud,
          }));
        return { data };
      },
    }),

    geographyHeat: builder.query<
      { region: string; districts: { name: string; value: number }[] }[],
      void
    >({
      async queryFn() {
        const byRegion = regions.map((r) => {
          const subset = txData.filter((t) => t.region === r);
          const districts = Array.from({ length: 5 }).map((_, i) => ({
            name: `${r.split(" ")[0]}-${i + 1}`,
            value: subset.filter((_, idx) => idx % 5 === i).length,
          }));
          return { region: r, districts };
        });
        return { data: byRegion };
      },
    }),
    alerts: builder.query<
      {
        id: string;
        message: string;
        timestamp: string;
        severity: "low" | "medium" | "high";
      }[],
      void
    >({
      async queryFn() {
        const now = Date.now();
        const alerts = Array.from({ length: 12 }).map((_, i) => ({
          id: `al_${i + 1}`,
          message: `Suspicious activity detected on ${randomChoice(
            providers
          )} in ${randomChoice(regions)}`,
          timestamp: new Date(now - i * 60_000).toISOString(),
          severity: randomChoice(["low", "medium", "high"] as const),
        }));
        return { data: alerts };
      },
    }),
  }),
});

export const {
  useKpisQuery,
  useTimeSeriesQuery,
  useGeographyHeatQuery,
  useAlertsQuery,
} = dashboardApi;
