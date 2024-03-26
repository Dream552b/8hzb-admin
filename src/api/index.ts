import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getMainInfo = () => {
  return http.request<Result>("get", "/mainInfo", {
    params: {
      _: new Date().getTime()
    }
  });
};

export const getCaptchaImage = params => {
  return http.request<Result>("get", "/admin/v2/adminUser/captchaImage", {
    params
  });
};

export const getDownloadLog = () => {
  return http.request<Result>("get", "/admin/v2/downloadLog/statistics", {
    params: {}
  });
};
