import { configureStore } from "@reduxjs/toolkit";
import fraudReducer from "./slices/fraudSlice";

export const store = configureStore({
  reducer: {
    fraud: fraudReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
