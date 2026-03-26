import { create } from "zustand";

const tokenKey = "crm_token";
const userKey = "crm_user";

export const useAuthStore = create(set => ({
  token: localStorage.getItem(tokenKey) || "",
  user: localStorage.getItem(userKey) ? JSON.parse(localStorage.getItem(userKey)) : null,
  login: (token, user) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    set({ token: "", user: null });
  }
}));