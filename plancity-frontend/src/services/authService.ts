import { request } from "../api/request";
import type { AuthResponse, LoginData, RegisterData } from "../types/auth";

export const authService = {
  login: (data: LoginData) =>
    request<AuthResponse>("POST", "/auth/login", data),

  register: (data: RegisterData) =>
    request<AuthResponse>("POST", "/auth/register", data),

  logout: () =>
    request<{ message: string }>("POST", "/auth/logout"),
};