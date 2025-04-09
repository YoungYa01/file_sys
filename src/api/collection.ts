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
  pinned: number;
  submitted_number: number;
  total_number: number;
  end_time: Date;
  created_at: Date;
  submitters: string[];
  reviewers: string[];
};

export type CollectionRequestType = {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: number;
  pinned?: number;
  access?: string;
  file_type?: string;
  founder?: number;
  end_time?: Date;
};

export const getCollectionList = (params?: CollectionRequestType) =>
  client.get<
    CollectionItemType,
    HttpResponse<Pagination<CollectionItemType[]>>
  >("/api/collection", { params });
