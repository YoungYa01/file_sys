import client from "@/api/request.ts";
import { HttpResponse, Pagination } from "@/utils/types";

export type UserType = {
  age: string;
  avatar: string;
  email: string;
  id: number;
  permission: string;
  phone: string;
  role_name: string;
  sex: string;
  status: string;
  token: string;
  username: string;
  nickname: string;
  org_id: number;
  org_name: string;
  leader: string;
  description: string;
  org_logo: string;
};

export type UserSearchType = {
  age?: string;
  avatar?: string;
  current?: number;
  email?: string;
  pageSize?: number;
  permission?: string;
  phone?: string;
  role_name?: string;
  sex?: string;
  status?: string;
  token?: string;
  username?: string;
};

export const getUserList = (params?: UserSearchType) =>
  client.get<UserType, HttpResponse<Pagination<UserType[]>>>("/api/users", {
    params,
  });

export const createUser = (data: UserType) =>
  client.post<UserType, HttpResponse<UserType>>("/api/users", data);

export const updateUser = (data: UserType) =>
  client.put<UserType, HttpResponse<UserType>>(`/api/users/${data.id}`, data);

export const deleteUser = (id: number) =>
  client.delete<number, HttpResponse<string>>(`/api/users/${id}`);
