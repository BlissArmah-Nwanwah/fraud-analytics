export const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const formatPercent = (n: number, digits = 1) =>
  `${(n).toFixed(digits)}%`;

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

