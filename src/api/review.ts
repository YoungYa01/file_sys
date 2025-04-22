import { HttpResponse, Pagination } from "@/utils/types";
import client from "@/api/request.ts";
import { CollectionItemType, CollectionRequestType } from "@/api/collection.ts";

export type Review = {
  id: number;
  collection_id: number;
  user_id: number;
  review_order: number;
  review_recommend: string;
  review_time: Date;
  username: string;
  submits: { id: number }[];
};

export const getReviewList = (params?: CollectionRequestType) =>
  client.get<
    CollectionItemType,
    HttpResponse<Pagination<CollectionItemType[]>>
  >(`/api/review`, {
    params,
  });

export const getReviewDetailsList = (
  id: number,
  params?: CollectionRequestType,
) =>
  client.get<Review, HttpResponse<Pagination<Review[]>>>(`/api/review/${id}`, {
    params,
  });

type ReviewStatus = {
  id: number;
  review_status: number;
  recommend: string;
};

export const updateReviewStatus = (data: ReviewStatus) =>
  client.put<ReviewStatus, HttpResponse<ReviewStatus>>(
    `/api/review/status`,
    data,
  );

export const exportReviewFile = (ids: string) =>
  client.get<string, Blob>(`/api/review/export?ids=${ids}`, {
    responseType: "blob",
  });
