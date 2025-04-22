import axios from "axios";
import { addToast } from "@heroui/react";

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
    if (response.data.code === 401) {
      addToast({
        color: "danger",
        description: response.data.msg,
      });

      return Promise.reject(response.data.msg);
    }

    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      addToast({
        color: "danger",
        description: error.response.data.msg,
        onClose: () => {
          window.location.href = "/login";
        },
      });

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default client;
