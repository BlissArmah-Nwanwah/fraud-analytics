import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  twoFAEnabled: boolean;
  defaultFilters: {
    region: string | null;
    provider: string | null;
  };
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    profile: builder.query<UserProfile, void>({
      async queryFn() {
        const profile: UserProfile = {
          id: "u_demo",
          name: "Demo User",
          email: "demo@example.com",
          twoFAEnabled: false,
          defaultFilters: { region: null, provider: null },
        };
        return { data: profile };
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      async queryFn(patch) {
        const merged: UserProfile = {
          id: "u_demo",
          name: patch.name ?? "Demo User",
          email: patch.email ?? "demo@example.com",
          twoFAEnabled: !!patch.twoFAEnabled,
          defaultFilters: patch.defaultFilters || { region: null, provider: null },
        };
        return { data: merged };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useProfileQuery, useUpdateProfileMutation } = userApi;

