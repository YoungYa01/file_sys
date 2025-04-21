import { HttpResponse, Pagination } from "@/utils/types";
import client from "@/api/request.ts";

type Review = {
  id: number;
  collection_id: number;
  user_id: number;
  review_order: number;
  review_recommend: string;
  review_time: Date;
  username: string;
};

export const getReviewList = (params?: Review) =>
  client.get<Review[], HttpResponse<Pagination<Review[]>>>(`/api/review`, {
    params,
  });
