import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getListChatAdvert = params => {
  return http.request<Result>("get", "/advert/sys/matchAdvert/listChatAdvert", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    params,
    data: {}
  });
};

export const queryMatch = params => {
  return http.request<Result>("get", "/advert/sys/matchAdvert/queryMatch", {
    params
  });
};

export const addChatAdvert = data => {
  return http.request<Result>("post", "/advert/sys/matchAdvert/addChatAdvert", {
    data
  });
};

export const updateChatAdvert = data => {
  return http.request<Result>(
    "put",
    "/advert/sys/matchAdvert/updateChatAdvert",
    {
      data
    }
  );
};

export const getChatAdvert = params => {
  return http.request<Result>("get", "/advert/sys/matchAdvert/getChatAdvert", {
    params
  });
};

export const delChatAdvert = data => {
  return http.request<Result>(
    "delete",
    "/advert/sys/matchAdvert/delChatAdvert",
    {
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  );
};
