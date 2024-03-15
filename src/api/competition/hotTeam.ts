import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getTeamList = params => {
  return http.request<Result>("get", "/admin/v2/competition/list", {
    params
  });
};

export const getHotTeamList = params => {
  return http.request<Result>("get", "/sys/team/team/data", {
    params
  });
};

export const addHotTeam = data => {
  return http.request<Result>("post", "/sys/team/add", {
    data
  });
};

export const cancelHotTeam = data => {
  return http.request<Result>("post", `/admin/v2/competition/update`, {
    data
  });
};

export const hotTeamMove = data => {
  return http.request<Result>("post", `/sys/team/move/${data.id}`, {
    data: {
      type: data.type
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};
