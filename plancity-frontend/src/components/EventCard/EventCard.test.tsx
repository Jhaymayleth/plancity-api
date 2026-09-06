import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

import { EventCard } from "./EventCard";
import { formatPriceCOP } from "../../utils/formatters";
import type { Event } from "../../types/event";
import type { Category } from "../../types/category";

// Mockear useAuth
vi.mock("../../context/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "user-1", email: "test@example.com" },
    token: "test-token",
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}));

// Mockear favoriteService
vi.mock("../../services/favoriteService", () => ({
  favoriteService: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock data según las interfaces reales
const mockCategory: Category = {
  id: "cat-1",
  name: "Conciertos",
  description: "Eventos de música en vivo",
  createdAt: "2024-08-31T00:00:00Z",
  updatedAt: "2024-08-31T00:00:00Z",
};

const mockEventWithImage: Event = {
  id: "event-1",
  name: "Festival de Música 2024",
  description: "Un increíble festival de música con artistas internacionales",
  date: "2024-12-31T20:00:00Z",
  location: "Central Park, Nueva York",
  price: 75.99,
  capacity: 5000,
  category: mockCategory,
  categoryId: "cat-1",
  images: [
    {
      id: "img-1",
      url: "https://example.com/festival-2024.jpg",
      order: 0,
      eventId: "event-1",
      createdAt: "2024-08-31T00:00:00Z",
    },
  ],
  createdAt: "2024-08-31T00:00:00Z",
  updatedAt: "2024-08-31T00:00:00Z",
};

const mockEventWithoutImage: Event = {
  ...mockEventWithImage,
  id: "event-2",
  name: "Charla de Desarrollo",
  images: [],
};

describe("EventCard", () => {
  const renderCard = (ui: ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the event name", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const heading = screen.getByText(mockEventWithImage.name);
    expect(heading).toBeInTheDocument();
  });

  it("should render the event category", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const category = screen.getByText(mockCategory.name);
    expect(category).toBeInTheDocument();
  });

  it("should render the event description", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const description = screen.getByText(mockEventWithImage.description);
    expect(description).toBeInTheDocument();
  });

  it("should render the event location", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const location = screen.getByText(new RegExp(mockEventWithImage.location));
    expect(location).toBeInTheDocument();
  });

  it("should render the event price with COP formatting", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const expectedPrice = formatPriceCOP(mockEventWithImage.price);
    const price = screen.getByText(
      (_, element) => element?.textContent === expectedPrice,
    );
    expect(price).toBeInTheDocument();
  });

  it("should render the image when event has images", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const image = screen.getByAltText(mockEventWithImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockEventWithImage.images[0].url);
  });

  it("should not render image when event has no images", () => {
    renderCard(
        <EventCard event={mockEventWithoutImage} />
    );

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });

  it("should render the 'Ver detalles' link", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const link = screen.getByRole("link", {
      name: /ver detalles/i,
    });
    expect(link).toBeInTheDocument();
  });

  it("should link to the correct event detail page", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const link = screen.getByRole("link", {
      name: /ver detalles/i,
    });
    expect(link).toHaveAttribute("href", `/events/${mockEventWithImage.id}`);
  });

  it("should have correct alt text for the image", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const image = screen.getByAltText(mockEventWithImage.name);
    expect(image.getAttribute("alt")).toBe(mockEventWithImage.name);
  });

  it("should render favorite button when user is authenticated", () => {
    renderCard(
        <EventCard event={mockEventWithImage} />
    );

    const favoriteButton = screen.getByRole("button", {
      name: /agregar.*a favoritos/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  it("should display unfavorited state with outline heart", () => {
    renderCard(
        <EventCard event={mockEventWithImage} isFavorite={false} />
    );

    const favoriteButton = screen.getByRole("button", {
      name: /agregar.*a favoritos/i,
    });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");
  });

  it("should display favorited state with filled heart", () => {
    renderCard(
        <EventCard event={mockEventWithImage} isFavorite={true} />
    );

    const favoriteButton = screen.getByRole("button", {
      name: /quitar.*de favoritos/i,
    });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  });
});
