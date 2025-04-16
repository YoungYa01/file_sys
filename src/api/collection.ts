import client from "@/api/request.ts";
import { HttpResponse, Pagination } from "@/utils/types";

export type CollectionItemType = {
  id: number;
  title: string;
  content: string;
  file_type: string;
  access: string;
  access_pwd: string;
  file_number: number;
  founder: number;
  status: number;
  pinned: string;
  submitted_number: number;
  total_number: number;
  end_time: Date;
  created_at: Date;
  submitters: string[];
  reviewers: string[];
};

export type CollectionRequestType = {
  current?: number;
  pageSize?: number;
  title?: string;
  status?: number;
  pinned?: number;
  access?: string;
  file_type?: string;
  founder?: number;
  end_time?: Date;
};

export type SubmitDetailType = {
  id?: number;
  collection_id?: number;
  user_id?: number;
  user_name?: string;
  task_status?: number;
  submit_time?: Date;
  file_path?: string;
  recommend?: string;
  file_name?: string;
  sort?: number;
  current?: number;
  pageSize?: number;
};

export const getCollectionList = (params?: CollectionRequestType) =>
  client.get<
    CollectionItemType,
    HttpResponse<Pagination<CollectionItemType[]>>
  >("/api/collection", { params });

export const getCollectionDetails = (id: number) =>
  client.get<CollectionItemType, HttpResponse<CollectionItemType>>(
    `/api/collection/${id}`,
  );

export const getCollectionSubmitDetails = (
  id: number,
  params: SubmitDetailType,
) =>
  client.get<SubmitDetailType, HttpResponse<Pagination<SubmitDetailType[]>>>(
    `/api/collection/submit/${id}`,
    { params },
  );
export const createCollection = (data: CollectionItemType) =>
  client.post<CollectionItemType, HttpResponse<CollectionItemType>>(
    "/api/collection",
    data,
  );
