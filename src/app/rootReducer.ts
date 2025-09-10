import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import { dashboardApi } from "@/api/dashboardApi";
import { userApi } from "@/api/userApi";
import { fraudDetectionApi } from "@/api/fraudDetectionApi";
import authReducer from "@/app/slices/authSlice";
import filtersReducer from "@/app/slices/filtersSlice";
import signupReducer from "@/app/slices/signupSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  filters: filtersReducer,
  signup: signupReducer,
  [authApi.reducerPath]: authApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [fraudDetectionApi.reducerPath]: fraudDetectionApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
