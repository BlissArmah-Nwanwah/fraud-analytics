import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import { dashboardApi } from "@/api/dashboardApi";
import { userApi } from "@/api/userApi";
import authReducer from "@/app/slices/authSlice";
import filtersReducer from "@/app/slices/filtersSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  filters: filtersReducer,
  [authApi.reducerPath]: authApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

