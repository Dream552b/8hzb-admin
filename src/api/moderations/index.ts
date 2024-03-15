import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getSensitiveWordList = params => {
  return http.request<Result>("get", "/admin/v2/sensitiveWord/list", {
    params
  });
};

export const createSensitiveWord = data => {
  return http.request<Result>("post", "/admin/v2/sensitiveWord/create", {
    data
  });
};

export const updateSensitiveWord = data => {
  return http.request<Result>("post", "/admin/v2/sensitiveWord/update", {
    data
  });
};

export const delSensitiveWord = data => {
  return http.request<Result>("post", "/admin/v2/sensitiveWord/delete", {
    data
  });
};
