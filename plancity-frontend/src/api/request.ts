import apiClient from "./client";

export const request = async <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  data?: unknown,
  params?: unknown,
): Promise<T> => {
  const response = await apiClient.request<T>({
    method,
    url,
    data,
    params,
  });

  return response.data;
};