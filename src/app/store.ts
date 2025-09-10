import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { rootReducer } from "@/app/rootReducer";
import { authApi } from "@/api/authApi";
import { dashboardApi } from "@/api/dashboardApi";
import { userApi } from "@/api/userApi";
import { fraudDetectionApi } from "@/api/fraudDetectionApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      userApi.middleware,
      fraudDetectionApi.middleware
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
