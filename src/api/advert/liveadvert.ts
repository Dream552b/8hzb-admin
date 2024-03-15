import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getAdvertList = params => {
  return http.get("/advert/sys/matchAdvert/listMatchAdvert", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    params,
    data: {}
  });
};

export const queryAdvertList = params => {
  return http.get("/advert/sys/matchAdvert/queryMatch", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    params,
    data: {}
  });
};

export const getMatchAdvert = params => {
  return http.request<Result>("get", "/advert/sys/matchAdvert/getMatchAdvert", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    params,
    data: {}
  });
};

export const updateMatchAdvert = data => {
  return http.request<Result>(
    "put",
    "/advert/sys/matchAdvert/updateMatchAdvert",
    {
      data
    }
  );
};

export const addMatchAdvert = data => {
  return http.request<Result>(
    "post",
    "/advert/sys/matchAdvert/addMatchAdvert",
    {
      data
    }
  );
};

export const delMatchAdvert = data => {
  return http.request<Result>(
    "delete",
    "/advert/sys/matchAdvert/delMatchAdvert",
    {
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  );
};
