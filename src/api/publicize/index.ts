import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getAdvertisementList = params => {
  return http.request<Result>("get", "/admin/v2/advertisement/list", {
    params
  });
};

export const createAdvertisement = data => {
  return http.request<Result>("post", "/admin/v2/advertisement/create", {
    data
  });
};

export const updateAdvertisement = data => {
  return http.request<Result>("post", "/admin/v2/advertisement/update", {
    data
  });
};

export const delAdvertisement = data => {
  return http.request<Result>("post", "/admin/v2/advertisement/delete", {
    data
  });
};
