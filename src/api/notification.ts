import client from "@/api/request.ts";
import { HttpResponse, Pagination } from "@/utils/types";

export type NotificationType = {
  id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  founder: string;
  pinned: string;
};

type NotificationSearchType = {
  title?: string;
  pinned?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export const getNotificationList = (params?: NotificationSearchType) =>
  client.get<NotificationType, HttpResponse<Pagination<NotificationType[]>>>(
    "/api/notification",
    { params },
  );

export const createNotification = (data: NotificationType) =>
  client.post<NotificationType, HttpResponse<NotificationType>>(
    "/api/notification",
    data,
  );
