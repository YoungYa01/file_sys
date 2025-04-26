import client from "@/api/request.ts";
import {UserType} from "@/api/users.ts";
import {HttpResponse} from "@/utils/types";

export const getUserinfo = () =>
  client.get<UserType, HttpResponse<UserType>>("/api/userinfo");
