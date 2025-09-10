import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "analyst" | "viewer";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  location?: string | null;
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserInfo }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
