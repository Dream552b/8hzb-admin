import { useUserStoreHook } from "@/store/modules/user";
const storageName = "token";

export function getToken() {
  return localStorage.getItem(storageName) || "";
}

export function setToken(data) {
  const { access_token, username } = data;
  useUserStoreHook().SET_USERNAME(username);
  return localStorage.setItem(storageName, access_token);
}

export function removeToken() {
  localStorage.removeItem(storageName);
}
