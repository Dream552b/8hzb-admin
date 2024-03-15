import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getPlaybackList = params => {
  return http.request<Result>("get", "/admin/v2/playback/list", {
    params
  });
};

export const createPlayback = data => {
  return http.request<Result>("post", "/admin/v2/playback/create", {
    data
  });
};

export const delPlayback = data => {
  return http.request<Result>("post", "/admin/v2/playback/delete", {
    data
  });
};
