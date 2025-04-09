import client from "@/api/request.ts";
import { HttpResponse, LoginType, Pagination } from "@/utils/types";

export type LoginResponse = {
  username: string;
  role_name: string;
  email: string;
  age: string;
  token: string;
  avatar: string;
  phone: string;
  sex: string;
  status: string;
  permission: string;
};

export const login = (data: LoginType) =>
  client.post<LoginResponse, HttpResponse<LoginResponse>>("/api/login", data);

export type CarouselItemType = {
  id: number;
  title: string;
  description: string;
  url: string;
  sort: number;
};

export type CarouselType = Pagination<CarouselItemType[]>;

export type CarouseSearchType = {
  title?: string;
  page?: number;
  pageSize?: number;
};
export const getCarouselList = (params?: CarouseSearchType) =>
  client.get<CarouselType, HttpResponse<CarouselType>>("/api/carousel", {
    params,
  });
