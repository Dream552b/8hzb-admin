import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getUserList = params => {
  // return http.request<Result>("get", "/app/sys/app/user/pageTiYu", {
  return http.request<Result>("get", "/admin/v2/user/list", {
    params
  });
};

export const getUserById = params => {
  return http.request<Result>("get", "/admin/v2/user/info", {
    params
  });
};

export const setUserAccountStatus = data => {
  return http.request<Result>("post", "/app/sys/app/user/sealMemberTiYu", {
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};

export const resetPassword = data => {
  return http.request<Result>("post", "/app/sys/app/user/resetPassword", {
    data
  });
};

export const updateUserInfo = data => {
  return http.request<Result>("post", "/admin/v2/user/update", {
    data
  });
};

export const getLoginLogs = params => {
  return http.request<Result>("get", "/admin/v2/user/loginLog", {
    params
  });
};

export const getAuthLogs = params => {
  return http.request<Result>("get", "/app/sys/app/user/auth/pageTiYu", {
    params
  });
};

export const updateUserNickname = data => {
  // return http.request<Result>("put", "/app/sys/app/user/nickname/reset", {
  return http.request<Result>("post", "/admin/v2/user/update", {
    data
  });
};

export const addUser = data => {
  return http.request<Result>("post", "/admin/v2/user/create", {
    data
  });
};
