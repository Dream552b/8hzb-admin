import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getVideoType = params => {
  return http.request<Result>("get", "/news/sys/video/type", {
    params
  });
};

export const getPlaybackList = params => {
  return http.request<Result>("get", "/news/sys/videoBack/list", {
    params
  });
};

export const postVideoBackEditState = id => {
  return http.request<Result>("post", `/news/sys/videoBack/editState/${id}`);
};

export const delVideoBack = ids => {
  return http.request<Result>("delete", `/news/sys/videoBack/del/${ids}`);
};
export const saveForeverVideo = data => {
  return http.request<Result>("put", "/news/sys/videoBack/editKeepState", {
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};

export const getVideoCateList = () => {
  return http.request<Result>(
    "get",
    `/news/sys/video/type?_=${new Date().getTime()}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  );
};

export const addVideoBack = data => {
  return http.request<Result>("post", `/news/sys/videoBack/add`, { data });
};

export const editVideoBack = data => {
  return http.request<Result>("post", `/news/sys/videoBack/edit`, { data });
};

export const getVideoBackEventList = params => {
  return http.request<Result>("get", `/news/sys/videoBack/getEventList`, {
    params
  });
};

export const getMatchList = params => {
  return http.request<Result>("get", `/news/sys/videoBack/getMatchList`, {
    params
  });
};

export const getSign = () => {
  return http.request<any>("get", `/app/sys/app/file/getSign`, {
    params: {
      filePath: "mp4/sphf/"
    }
  });
};
