import { request } from "../api/request";
import type { Category, CategoryData } from "../types/category";

export const categoryService = {
  getAll: () =>
    request<Category[]>("GET", "/categories"),

  getById: (id: string) =>
    request<Category>("GET", `/categories/${id}`),

  create: (data: CategoryData) =>
    request<Category>("POST", "/categories", data),

  update: (id: string, data: CategoryData) =>
    request<Category>("PATCH", `/categories/${id}`, data),

  remove: (id: string) =>
    request<void>("DELETE", `/categories/${id}`),
};