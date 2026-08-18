import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const adminUsersApi = createApi({
  reducerPath: "adminUsersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ search, role }) => ({
        url: "/admin/users",
        method: "GET",
        params: { search, role },
      }),
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    impersonateUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/impersonate`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useImpersonateUserMutation,
} = adminUsersApi;
