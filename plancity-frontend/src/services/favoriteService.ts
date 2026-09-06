import { request } from "../api/request";
import type { Event } from "../types/event";

export const favoriteService = {
  getAll: () =>
    request<Event[]>("GET", "/favorites"),

  add: (eventId: string) =>
    request<void>("POST", `/favorites/${eventId}`),

  remove: (eventId: string) =>
    request<void>("DELETE", `/favorites/${eventId}`),
};