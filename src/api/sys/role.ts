import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Object;
};

export const getRoleList = params => {
  return http.request<Result>("get", "/admin/system/role/page", {
    params
  });
};

export const getRoleInfo = params => {
  return http.request<Result>(
    "get",
    `/admin/system/role/role/roleMenuData/${params.id}`
  );
};

export const getRoleTreeData = () => {
  return http.request<Result>("get", "/admin/system/menu/listData");
};

export const saveRole = data => {
  return http.request<Result>("post", "/admin/system/role/editRoleMenu", {
    data
  });
};

export const delRole = data => {
  return http.request<Result>("post", "/admin/system/role/deleteDataByIds", {
    data
  });
};
