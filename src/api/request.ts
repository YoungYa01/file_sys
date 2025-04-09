import axios from "axios";

import { TOKEN } from "@/utils/const.ts";

const client = axios.create({
  baseURL: "/",
  timeout: 1000,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN);

    if (token) {
      config.headers["token"] = token;
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
