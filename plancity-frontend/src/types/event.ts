import type { Category } from "./category";

export interface EventImage {
  id: string;
  url: string;
  order: number;
  eventId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  category: Category;
  categoryId: string;
  images: EventImage[];
  createdAt: string;
  updatedAt: string;
}

export interface EventData {
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images: string[];
}