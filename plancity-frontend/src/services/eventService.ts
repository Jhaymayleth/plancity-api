import { request } from "../api/request";
import type { Event, EventData } from "../types/event";

interface EventFilters {
  search?: string;
  categoryId?: string;
}

export const eventService = {
  getAll: (filters?: EventFilters) =>
  request<Event[]>("GET", "/events", undefined, filters),

  getById: (id: string) =>
    request<Event>("GET", `/events/${id}`),

  create: (data: EventData) =>
    request<Event>("POST", "/events", data),

  update: (id: string, data: EventData) =>
    request<Event>("PATCH", `/events/${id}`, data),

  remove: (id: string) =>
    request<void>("DELETE", `/events/${id}`),
};