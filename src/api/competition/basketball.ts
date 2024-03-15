import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getBasketballScheduleList = params => {
  return http.request<Result>("get", "/admin/v2/match/list", {
    params
  });
};

export const getBasketballMatchData = params => {
  return http.request<Result>("get", `/sys/basketball/match/data/${params.id}`);
};

export const getBasketballLiveData = params => {
  return http.request<Result>(
    "get",
    `/sys/basketball/match/detail/${params.id}`
  );
};

export const getBasketballEventIndexData = params => {
  return http.request<Result>("get", `/sys/basketball/match/odds/${params.id}`);
};

export const updateVideoSource = data => {
  return http.request<Result>("post", `/admin/v2/match/updateVideoSource`, {
    data
  });
};
