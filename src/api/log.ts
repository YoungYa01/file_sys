import client from "./request";
import {HttpResponse, Pagination} from "@/utils/types";

export type LogType = {
  id: number;
  user_id: number;
  username: string;
  ip: string;
  os: string;
  params: string;
  method: string;
  api_url: string;
  created_at: string;
  updated_at: string;
  browser: string;
  province: string;
  city: string;
};

type LogParamsType = {
  current?: number;
  pageSize?: number;
  user_id?: number;
  username?: string;
  ip?: string;
  os?: string;
  method?: string;
  api_url?: string;
};

export const getLogList = (params?: LogParamsType) =>
  client.get<LogType, HttpResponse<Pagination<LogType[]>>>("/api/log", {
    params,
  });

export const deleteLog = (id: number) =>
  client.delete<LogType, HttpResponse<LogType>>(`/api/log/${id}`);
