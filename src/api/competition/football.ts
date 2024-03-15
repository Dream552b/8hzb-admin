import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getFootballScheduleList = params => {
  return http.request<Result>("get", "/admin/v2/match/list", {
    params
  });
};

export const getFootballMatchData = params => {
  return http.request<Result>("get", `/sys/football/match/data/${params.id}`);
};

export const getFootballLiveData = params => {
  return http.request<Result>("get", `/sys/football/match/detail/${params.id}`);
};

export const getFootballEventIndexData = params => {
  return http.request<Result>("get", `/sys/football/match/odds/${params.id}`);
};

export const updateTopStatus = data => {
  return http.request<Result>("post", `/admin/v2/match/updateTopStatus`, {
    data
  });
};

export const updateIsClose = data => {
  return http.request<Result>("post", `/admin/v2/match/updateIsClose`, {
    data
  });
};
