import client from "@/api/request.ts";
import { HttpResponse } from "@/utils/types";

type UploadResponse = string;

export const uploadFile = (data: FormData) =>
  client.post<UploadResponse, HttpResponse<UploadResponse>>("/api/upload", data);
