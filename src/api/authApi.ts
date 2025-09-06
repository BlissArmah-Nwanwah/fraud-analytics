import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials, type UserInfo } from "@/app/slices/authSlice";

type LoginRequest = { email: string; password: string };
type SignupRequest = { name: string; email: string; password: string };

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: UserInfo }, LoginRequest>({
      async queryFn(arg, _api, _extra, _baseQuery) {
        // Mocked auth: accept any email/password, infer role by email prefix
        const role = arg.email.startsWith("admin")
          ? "admin"
          : arg.email.startsWith("analyst")
          ? "analyst"
          : "viewer";
        const user: UserInfo = {
          id: "u_" + Math.random().toString(36).slice(2, 9),
          name: arg.email.split("@")[0],
          email: arg.email,
          role,
        };
        const token = btoa(`${user.email}:${Date.now()}`);
        return { data: { token, user } };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),
    signup: builder.mutation<{ token: string; user: UserInfo }, SignupRequest>({
      async queryFn(arg) {
        const user: UserInfo = {
          id: "u_" + Math.random().toString(36).slice(2, 9),
          name: arg.name,
          email: arg.email,
          role: "viewer",
        };
        const token = btoa(`${user.email}:${Date.now()}`);
        return { data: { token, user } };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      async queryFn() {
        return { data: { success: true } };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearCredentials());
      },
    }),
    refresh: builder.query<{ token: string }, void>({
      async queryFn() {
        const token = btoa(`refresh:${Date.now()}`);
        return { data: { token } };
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useRefreshQuery } = authApi;

