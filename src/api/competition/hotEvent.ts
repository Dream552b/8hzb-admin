import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getHotEventList = params => {
  return http.request<Result>("get", "/admin/v2/hotCompetition/list", {
    params
  });
};

export const hotEventeUp = data => {
  return http.request<Result>("post", `/admin/v2/hotCompetition/update`, {
    data
  });
};

export const cancelHotEvent = data => {
  return http.request<Result>("post", `/admin/v2/hotCompetition/delete`, {
    data
  });
};
export const getEventList = params => {
  return http.request<Result>("get", `/admin/v2/competition/list`, {
    params
  });
};
export const addHotEvent = data => {
  return http.request<Result>("post", `/admin/v2/hotCompetition/create`, {
    data
  });
};
