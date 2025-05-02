import client from "@/api/request.ts";
import { CollectionItemType, CollectionRequestType } from "@/api/collection.ts";
import { HttpResponse, Pagination } from "@/utils/types";

export const getMyTaskList = (params?: CollectionRequestType) =>
  client.get<
    CollectionItemType,
    HttpResponse<Pagination<CollectionItemType[]>>
  >("/api/my-task", { params });
