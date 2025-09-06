import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FraudData {
  id: string;
  amount: number;
  timestamp: string;
  type: "credit_card" | "bank_transfer" | "online_payment";
  risk_score: number;
  status: "pending" | "approved" | "rejected";
}

interface FraudState {
  data: FraudData[];
  loading: boolean;
  error: string | null;
  totalAmount: number;
  highRiskCount: number;
}

const initialState: FraudState = {
  data: [
    {
      id: "1",
      amount: 1250.5,
      timestamp: "2024-01-15T10:30:00Z",
      type: "credit_card",
      risk_score: 85,
      status: "pending",
    },
    {
      id: "2",
      amount: 5000.0,
      timestamp: "2024-01-15T11:15:00Z",
      type: "bank_transfer",
      risk_score: 95,
      status: "rejected",
    },
    {
      id: "3",
      amount: 250.75,
      timestamp: "2024-01-15T12:00:00Z",
      type: "online_payment",
      risk_score: 45,
      status: "approved",
    },
  ],
  loading: false,
  error: null,
  totalAmount: 6501.25,
  highRiskCount: 2,
};

const fraudSlice = createSlice({
  name: "fraud",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addFraudData: (state, action: PayloadAction<FraudData>) => {
      state.data.push(action.payload);
      state.totalAmount += action.payload.amount;
      if (action.payload.risk_score > 80) {
        state.highRiskCount += 1;
      }
    },
    updateFraudStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "approved" | "rejected";
      }>
    ) => {
      const fraud = state.data.find((item) => item.id === action.payload.id);
      if (fraud) {
        fraud.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  addFraudData,
  updateFraudStatus,
  clearError,
} = fraudSlice.actions;
export default fraudSlice.reducer;
