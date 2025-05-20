import client from "@/api/request.ts";
import { HttpResponse, Pagination } from "@/utils/types";

export type RoleType = {
  id: number;
  role_name: string;
  description: string;
  sort: number;
  status: string;
  permission: string;
};

type RoleSearchType = {
  role_name?: string;
  status?: string;
  current?: number;
  pageSize?: number;
};

export const getRoleList = (params?: RoleSearchType) =>
  client.get<RoleType, HttpResponse<Pagination<RoleType[]>>>("/api/roles", {
    params,
  });

export const createRole = (data: RoleType) =>
  client.post<RoleType, HttpResponse<RoleType>>("/api/roles", data);

export const updateRole = (data: RoleType) =>
  client.put<RoleType, HttpResponse<RoleType>>(`/api/roles/${data.id}`, data);

export const deleteRole = (id: number) =>
  client.delete<RoleType, HttpResponse<RoleType>>(`/api/roles/${id}`);
