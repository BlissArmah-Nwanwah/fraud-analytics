export interface MetricsInput {
  transactions: number;
  flagged: number;
  confirmedFraud: number;
}

export const precision = ({ flagged, confirmedFraud }: MetricsInput) =>
  flagged ? (confirmedFraud / flagged) : 0;

export const recall = ({ transactions, confirmedFraud }: MetricsInput) =>
  transactions ? (confirmedFraud / transactions) : 0;

export const flaggedRate = ({ transactions, flagged }: MetricsInput) =>
  transactions ? flagged / transactions : 0;

export const lossesPrevented = (confirmedFraudAmount: number, factor = 0.4) =>
  confirmedFraudAmount * factor;

