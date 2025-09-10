import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  dateRange: { from: string | null; to: string | null };
  region: string | null;
  provider: string | null;
  days: number; // lookback window for fraud overview
}

const initialState: FiltersState = {
  dateRange: { from: null, to: null },
  region: null,
  provider: null,
  days: 30,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.dateRange = action.payload;
    },
    setRegion: (state, action: PayloadAction<string | null>) => {
      state.region = action.payload;
    },
    setProvider: (state, action: PayloadAction<string | null>) => {
      state.provider = action.payload;
    },
    setDays: (state, action: PayloadAction<number>) => {
      state.days = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setDateRange, setRegion, setProvider, setDays, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
