import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setCredentials,
  clearCredentials,
  setUser,
} from "@/app/slices/authSlice";
import type { UserInfo } from "@/app/slices/authSlice";
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
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
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
          role: "user",
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
          role: (apiUser.role?.toLowerCase?.() as UserInfo["role"]) || "user",
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
    me: builder.query<UserInfo, void>({
      query: () => ({ url: "api/auth/me" }),
      async transformResponse(response: {
        message: string;
        data: {
          user: Partial<{
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            name: string;
            username: string | null;
            email: string;
            role: string;
          }>;
        };
      }) {
        const apiUser = response?.data?.user ?? {};
        const apiRole = apiUser.role?.toString().toUpperCase();
        const roleMap: Record<string, UserInfo["role"]> = {
          ADMIN: "admin",
          USER: "user",
        };
        const roleKey = (apiRole ?? "") as keyof typeof roleMap;
        const user: UserInfo = {
          id: apiUser.id ?? apiUser.userId ?? "",
          name:
            `${apiUser.firstName ?? ""} ${apiUser.lastName ?? ""}`.trim() ??
            apiUser.name ??
            apiUser.username ??
            "",
          email: apiUser.email ?? "",
          role: roleMap[roleKey] ?? "user",
          avatar: (apiUser as { avatar?: string | null }).avatar ?? null,
          firstName:
            (apiUser as { firstName?: string | null }).firstName ?? null,
          lastName: (apiUser as { lastName?: string | null }).lastName ?? null,
          username: (apiUser as { username?: string | null }).username ?? null,
          location: (apiUser as { location?: string | null }).location ?? null,
        };
        return user;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // noop
        }
      },
    }),
    updateMyProfile: builder.mutation<
      UserInfo,
      Partial<{
        firstName: string;
        lastName: string;
        username: string;
        location: string;
      }>
    >({
      query: (body) => ({ url: "api/auth/profile", method: "PATCH", body }),
      async transformResponse(response: {
        message: string;
        data: {
          user: Partial<{
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            name: string;
            username: string | null;
            email: string;
            role: string;
            avatar?: string | null;
            location?: string | null;
          }>;
        };
      }) {
        const apiUser = response?.data?.user ?? {};
        const apiRole = apiUser.role?.toString().toUpperCase();
        const roleMap: Record<string, UserInfo["role"]> = {
          ADMIN: "admin",
          USER: "user",
        };
        const roleKey = (apiRole ?? "") as keyof typeof roleMap;
        const user: UserInfo = {
          id: apiUser.id ?? apiUser.userId ?? "",
          name:
            `${apiUser.firstName ?? ""} ${apiUser.lastName ?? ""}`.trim() ??
            apiUser.name ??
            apiUser.username ??
            "",
          email: apiUser.email ?? "",
          role: roleMap[roleKey] ?? "user",
          avatar: (apiUser as { avatar?: string | null }).avatar ?? null,
          firstName:
            (apiUser as { firstName?: string | null }).firstName ?? null,
          lastName: (apiUser as { lastName?: string | null }).lastName ?? null,
          username: (apiUser as { username?: string | null }).username ?? null,
          location: (apiUser as { location?: string | null }).location ?? null,
        };
        return user;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // noop
        }
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
  useMeQuery,
  useUpdateMyProfileMutation,
} = authApi;
