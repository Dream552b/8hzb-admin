import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const addLive = data => {
  return http.request<Result>("post", "/admin/v2/matchLive/create", {
    data
  });
};

export const editLive = data => {
  return http.request<Result>("post", "/admin/v2/matchLive/update", {
    data
  });
};

export const getLiveList = params => {
  return http.request<Result>("get", "/admin/v2/matchLive/list", {
    params
  });
};

export const delLive = data => {
  return http.request<Result>("post", "/admin/v2/matchLive/delete", {
    data
  });
};

export const postStartLive = params => {
  return http.request<Result>("get", "/sys/live/start", {
    params
  });
};
export const postEndLive = params => {
  return http.request<Result>("get", "/sys/live/stop", {
    params
  });
};

export const getFootballScheduleList = params => {
  return http.request<Result>("get", "/admin/v2/match/list", {
    params
  });
};

export const getBasketballScheduleList = params => {
  return http.request<Result>("get", "/admin/v2/match/list", {
    params
  });
};
