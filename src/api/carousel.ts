import client from "@/api/request.ts";
import { CarouselItemType } from "@/api/public.ts";
import { HttpResponse } from "@/utils/types";

export const createCarousel = (data: CarouselItemType) =>
  client.post<CarouselItemType, HttpResponse<CarouselItemType>>(
    "/api/carousel",
    data,
  );

export const updateCarousel = (data: CarouselItemType) =>
  client.put<CarouselItemType, HttpResponse<CarouselItemType>>(
    `/api/carousel/${data.id}`,
    data,
  );

export const deleteCarousel = (id: number) =>
  client.delete<CarouselItemType, HttpResponse<CarouselItemType>>(
    `/api/carousel/${id}`,
  );
