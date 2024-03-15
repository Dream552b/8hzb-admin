import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getSmsList = params => {
  return http.request<Result>("get", "/app/sys/app/user/shortmessage/log", {
    params
  });
};
