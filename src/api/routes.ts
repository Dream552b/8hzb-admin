import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/admin/system/role/curUserMenu", {
    params: {
      isnewmanage: 1
    }
  });
};
