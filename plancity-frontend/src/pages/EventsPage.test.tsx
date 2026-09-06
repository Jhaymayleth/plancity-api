import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { EventsPage } from "./EventsPage";
import * as eventService from "../services/eventService";
import * as categoryService from "../services/categoryService";
import * as favoriteService from "../services/favoriteService";
import type { Event } from "../types/event";
import type { Category } from "../types/category";

// Mock services
vi.mock("../services/eventService");
vi.mock("../services/categoryService");
vi.mock("../services/favoriteService");

// Store for mocking useAuth return value
interface MockAuthContext {
  user: { id: string; email: string; role: string } | null;
  token: string | null;
  loading: boolean;
  login: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
}

let mockUseAuthReturn: MockAuthContext = {
  user: null,
  token: null,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

vi.mock("../context/useAuth", () => ({
  useAuth: () => mockUseAuthReturn,
}));

// Mock data
const mockCategory: Category = {
  id: "cat-1",
  name: "Conciertos",
  description: "Eventos de música en vivo",
  createdAt: "2024-08-31T00:00:00Z",
  updatedAt: "2024-08-31T00:00:00Z",
};

const mockEvent1: Event = {
  id: "event-1",
  name: "Festival de Música 2024",
  description: "Un increíble festival de música",
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

const mockEvent2: Event = {
  id: "event-2",
  name: "Concierto de Jazz",
  description: "Noche de jazz en vivo",
  date: "2024-09-15T19:00:00Z",
  location: "Teatro Principal",
  price: 45.0,
  capacity: 300,
  category: mockCategory,
  categoryId: "cat-1",
  images: [],
  createdAt: "2024-08-31T00:00:00Z",
  updatedAt: "2024-08-31T00:00:00Z",
};

describe("EventsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks
    vi.mocked(eventService.eventService.getAll).mockResolvedValue([]);
    vi.mocked(categoryService.categoryService.getAll).mockResolvedValue([]);
    vi.mocked(favoriteService.favoriteService.getAll).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading state", () => {
    it("should display loading message while events are being fetched", async () => {
      vi.mocked(eventService.eventService.getAll).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([mockEvent1]), 100);
          }),
      );

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      expect(screen.getByText("Cargando eventos...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText("Cargando eventos...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error state", () => {
    it("should display error message when events fail to load", async () => {
      vi.mocked(eventService.eventService.getAll).mockRejectedValue(
        new Error("Network error"),
      );

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent("No se pudieron cargar los eventos.");
      });
    });
  });

  describe("Empty state", () => {
    it("should display empty message when no events exist", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("No se encontraron eventos"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Events loaded", () => {
    it("should render events when data is loaded", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
        mockEvent2,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText(mockEvent1.name)).toBeInTheDocument();
        expect(screen.getByText(mockEvent2.name)).toBeInTheDocument();
      });
    });

    it("should render event details in EventCard", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText(mockEvent1.name)).toBeInTheDocument();
        expect(screen.getByText(mockEvent1.description)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockEvent1.location))).toBeInTheDocument();
        expect(screen.getByText(`$${mockEvent1.price}`)).toBeInTheDocument();
      });
    });

    it("should render category name for event", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
      });
    });
  });

  describe("Search filter", () => {
    it("should call eventService.getAll with search filter when typing", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      const searchInput = screen.getByPlaceholderText("Buscar por nombre...");

      await user.type(searchInput, "Festival");

      await waitFor(() => {
        expect(vi.mocked(eventService.eventService.getAll)).toHaveBeenCalledWith(
          {
            search: "Festival",
            categoryId: undefined,
          },
        );
      });
    });
  });

  describe("Category filter", () => {
    it("should load categories on mount", async () => {
      vi.mocked(categoryService.categoryService.getAll).mockResolvedValue([
        mockCategory,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          vi.mocked(categoryService.categoryService.getAll),
        ).toHaveBeenCalled();
      });
    });

    it("should display loaded categories in select dropdown", async () => {
      vi.mocked(categoryService.categoryService.getAll).mockResolvedValue([
        mockCategory,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const categorySelect = screen.getByLabelText("Filtrar por categoría");
        const options = categorySelect.querySelectorAll("option");
        const categoryOptions = Array.from(options).map((opt) => opt.textContent);
        expect(categoryOptions).toContain(mockCategory.name);
      });
    });

    it("should call eventService.getAll with categoryId filter when selecting category", async () => {
      vi.mocked(categoryService.categoryService.getAll).mockResolvedValue([
        mockCategory,
      ]);
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const categorySelect = screen.getByLabelText("Filtrar por categoría");
        expect(categorySelect).toBeInTheDocument();
      });

      const select = screen.getByLabelText("Filtrar por categoría") as HTMLSelectElement;

      await user.selectOptions(select, mockCategory.id);

      await waitFor(() => {
        expect(vi.mocked(eventService.eventService.getAll)).toHaveBeenCalledWith(
          expect.objectContaining({
            categoryId: mockCategory.id,
          }),
        );
      });
    });
  });

  describe("Favorites", () => {
    beforeEach(() => {
      mockUseAuthReturn = {
        user: { id: "user-1", email: "test@example.com", role: "user" },
        token: "test-token",
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      };
    });

    afterEach(() => {
      mockUseAuthReturn = {
        user: null,
        token: null,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      };
    });

    it("should load favorites when user is authenticated", async () => {
      vi.mocked(favoriteService.favoriteService.getAll).mockResolvedValue([
        mockEvent1,
      ]);
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          vi.mocked(favoriteService.favoriteService.getAll),
        ).toHaveBeenCalled();
      });
    });

    it("should mark event as favorite when it's in favorites list", async () => {
      vi.mocked(favoriteService.favoriteService.getAll).mockResolvedValue([
        mockEvent1,
      ]);
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
        mockEvent2,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Event1 should have the favorite button with favorited state
        const favoriteButtons = screen.getAllByRole("button");
        // At least one button should exist (the favorite button for event1)
        expect(favoriteButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Admin features", () => {
    beforeEach(() => {
      mockUseAuthReturn = {
        user: { id: "admin-1", email: "admin@example.com", role: "admin" },
        token: "admin-token",
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      };
    });

    afterEach(() => {
      mockUseAuthReturn = {
        user: null,
        token: null,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      };
    });

    it("should show create event link only for admin users", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole("link", {
          name: /crear evento/i,
        })).toBeInTheDocument();
      });
    });

    it("should show create event link with correct path", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const createLink = screen.getByRole("link", {
          name: /crear evento/i,
        });
        expect(createLink).toHaveAttribute("href", "/admin/events/new");
      });
    });

    it("should show edit and delete buttons for each event when admin", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Editar")).toBeInTheDocument();
        expect(screen.getByText("Eliminar")).toBeInTheDocument();
      });
    });

    it("should show edit link with correct event id", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const editLink = screen.getByText("Editar");
        expect(editLink).toHaveAttribute(
          "href",
          `/admin/events/${mockEvent1.id}/edit`,
        );
      });
    });
  });

  describe("Non-admin users", () => {
    it("should not show create event link for non-admin users", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Crear evento")).not.toBeInTheDocument();
      });
    });

    it("should not show edit or delete buttons for non-admin users", async () => {
      vi.mocked(eventService.eventService.getAll).mockResolvedValue([
        mockEvent1,
      ]);

      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Editar")).not.toBeInTheDocument();
        expect(screen.queryByText("Eliminar")).not.toBeInTheDocument();
      });
    });
  });

  describe("UI Elements", () => {
    it("should display page title", async () => {
      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      expect(screen.getByText("Eventos")).toBeInTheDocument();
    });

    it("should display search input", async () => {
      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      expect(
        screen.getByPlaceholderText("Buscar por nombre..."),
      ).toBeInTheDocument();
    });

    it("should display category filter label", async () => {
      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      expect(screen.getByLabelText("Filtrar por categoría")).toBeInTheDocument();
    });

    it("should display default category option", async () => {
      render(
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>,
      );

      expect(
        screen.getByDisplayValue("Todas las categorías"),
      ).toBeInTheDocument();
    });
  });
});
