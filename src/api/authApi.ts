import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setCredentials,
  clearCredentials,
  type UserInfo,
} from "@/app/slices/authSlice";
import { API_BASE_URL } from "@/config/env";
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: UserInfo }, LoginRequest>({
      query: (body) => ({
        url: "api/auth/login",
        method: "POST",
        body,
      }),
      async transformResponse(response: LoginResponse, _meta, arg) {
        const user: UserInfo = {
          id: response.data.userId,
          name: arg.email.split("@")[0],
          email: arg.email,
          role: "viewer",
        };
        return { token: response.data.token, user };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
    register: builder.mutation<
      { token: string; user: UserInfo },
      RegisterRequest
    >({
      query: (body) => ({
        url: "api/auth/register",
        method: "POST",
        body,
      }),
      async transformResponse(response: RegisterResponse) {
        const apiUser = response.data.user;
        const user: UserInfo = {
          id: apiUser.id,
          name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
          email: apiUser.email,
          role: (apiUser.role?.toLowerCase?.() as UserInfo["role"]) || "viewer",
        };
        return { token: response.data.token, user };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      async queryFn() {
        return { data: { success: true } };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
        }
      },
    }),
    refresh: builder.query<{ token: string }, void>({
      async queryFn() {
        const token = btoa(`refresh:${Date.now()}`);
        return { data: { token } };
      },
    }),
    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "api/auth/forgot-password",
        method: "POST",
        body,
      }),
      async transformResponse(response: ForgotPasswordResponse) {
        return { message: response.message };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshQuery,
  useForgotPasswordMutation,
} = authApi;
