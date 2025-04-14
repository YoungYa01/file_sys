import client from "@/api/request.ts";
import { HttpResponse } from "@/utils/types";

export type OrganizationType = {
  id: number;
  description: string;
  org_name: string;
  parent_id: number;
  org_logo: string;
  leader: string;
  status: number;
  sort: number;
  children?: OrganizationType[];
};

type OrgRequestType = {
  org_name?: string;
  status?: number;
  current?: number;
  pageSize?: number;
};

export const getOrgList = (params: OrgRequestType) =>
  client.get<OrgRequestType, HttpResponse<OrganizationType[]>>(
    "/api/organization",
    {
      params,
    },
  );

export const createOrg = (data: OrganizationType) =>
  client.post<OrganizationType, HttpResponse<OrganizationType>>(
    "/api/organization",
    data,
  );

export const updateOrg = (data: OrganizationType) =>
  client.put<OrganizationType, HttpResponse<OrganizationType>>(
    `/api/organization/${data.id}`,
    data,
  );

export const deleteOrg = (id: number[]) =>
  client.delete<number, HttpResponse<number>>(`/api/organization/${id}`);
