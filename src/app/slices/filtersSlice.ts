import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  dateRange: { from: string | null; to: string | null };
  region: string | null;
  provider: string | null;
}

const initialState: FiltersState = {
  dateRange: { from: null, to: null },
  region: null,
  provider: null,
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
    resetFilters: () => initialState,
  },
});

export const { setDateRange, setRegion, setProvider, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
