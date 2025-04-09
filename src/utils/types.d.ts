export type HttpResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export type LoginType = {
  username: string;
  password: string;
};

export type Pagination<T> = {
  page: number;
  pageSize: number;
  total: number;
  data: T;
};
