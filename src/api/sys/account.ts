import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getAccountList = params => {
  return http.request<Result>("get", "/admin/system/user", {
    params
  });
};

export const saveAccount = data => {
  return http.request<Result>("post", "/admin/system/user/add", {
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};

export const updateAccount = data => {
  return http.request<Result>("put", "/admin/system/user/update", {
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};

export const delAccount = data => {
  return http.request<Result>(
    "delete",
    `/admin/system/user/delete/${data.userId}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  );
};

export const saveModifyPassword = data => {
  return http.request<Result>("put", `/admin/system/user/update/password`, {
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
};
