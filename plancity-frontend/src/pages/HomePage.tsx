import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  LayoutGrid,
  Lock,
  Search,
  SlidersHorizontal,
  Smartphone,
  Ticket,
} from "lucide-react";

import { EventCard } from "../components/EventCard/EventCard";
import { EventCardSkeleton } from "../components/ui";
import { useAuth } from "../context/useAuth";
import {
  useCategoriesQuery,
  useEventsQuery,
  useFavoritesQuery,
} from "../hooks/useEventsQuery";
import { getEventStatus } from "../utils/formatters";

const FEATURES = [
  {
    icon: Ticket,
    title: "Descubrimiento fácil",
    description: "Explora miles de eventos categorizados y filtrados por tus intereses.",
  },
  {
    icon: Heart,
    title: "Guarda favoritos",
    description: "Marca tus eventos favoritos y accede a ellos en cualquier momento.",
  },
  {
    icon: CalendarDays,
    title: "Información completa",
    description: "Detalles completos: ubicación, fecha, precio y descripción de cada evento.",
  },
  {
    icon: Smartphone,
    title: "Diseño responsivo",
    description: "Accede desde cualquier dispositivo: computadora, tablet o teléfono.",
  },
  {
    icon: Lock,
    title: "Cuenta segura",
    description: "Autenticación segura con contraseñas encriptadas.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtros inteligentes",
    description: "Encuentra exactamente lo que buscas con nuestro sistema de filtros.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const eventsQuery = useEventsQuery();
  const categoriesQuery = useCategoriesQuery();
  const favoritesQuery = useFavoritesQuery(Boolean(user));

  const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((event) => event.id)),
    [favoritesQuery.data],
  );

  // La API ya ordena por fecha ASC: los próximos son los primeros no finalizados.
  const upcoming = useMemo(
    () =>
      events
        .filter((event) => getEventStatus(event.date) !== "finalizado")
        .slice(0, 3),
    [events],
  );

  const eventsByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) {
      counts.set(event.categoryId, (counts.get(event.categoryId) ?? 0) + 1);
    }
    return counts;
  }, [events]);

  const stats = useMemo(
    () => ({
      upcoming: events.filter(
        (event) => getEventStatus(event.date) !== "finalizado",
      ).length,
      free: events.filter((event) => event.price === 0).length,
      categories: categories.length,
    }),
    [events, categories],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(
      trimmed ? `/events?search=${encodeURIComponent(trimmed)}` : "/events",
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Descubre tu próximo evento
          </h1>

          <p className="mt-6 text-xl leading-relaxed text-indigo-100 sm:text-2xl">
            Encuentra conciertos, talleres, actividades deportivas y mucho más en tu ciudad. Planifica tus momentos especiales con PlanCity.
          </p>

          <form
            onSubmit={handleSearch}
            role="search"
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="home-search" className="sr-only">
              Buscar eventos
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="¿Qué quieres hacer hoy? Prueba con “jazz”…"
                className="w-full rounded-xl bg-white py-4 pl-12 pr-4 text-lg text-slate-900 shadow-xl outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-xl transition hover:bg-slate-800"
            >
              Buscar
            </button>
          </form>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition hover:bg-slate-50 hover:shadow-2xl"
            >
              Explorar eventos
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Ver categorías
            </Link>
          </div>

          {eventsQuery.isSuccess && (
            <dl className="mt-12 flex flex-wrap gap-8 text-indigo-100">
              <div>
                <dt className="sr-only">Próximos eventos</dt>
                <dd className="text-3xl font-bold text-white">
                  {stats.upcoming}
                </dd>
                <dd className="text-sm">próximos eventos</dd>
              </div>
              <div>
                <dt className="sr-only">Categorías</dt>
                <dd className="text-3xl font-bold text-white">
                  {stats.categories}
                </dd>
                <dd className="text-sm">categorías</dd>
              </div>
              <div>
                <dt className="sr-only">Eventos gratuitos</dt>
                <dd className="text-3xl font-bold text-white">{stats.free}</dd>
                <dd className="text-sm">eventos gratuitos</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl"></div>
      </section>

      {/* Upcoming Section */}
      <section
        aria-label="Próximos eventos"
        className="mx-auto max-w-7xl px-6 py-20 sm:py-24"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              No te los pierdas
            </p>
            <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Próximos eventos
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            Ver todos <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {eventsQuery.isPending && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        )}

        {eventsQuery.isSuccess && upcoming.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            Aún no hay eventos próximos. Vuelve pronto.
          </p>
        )}

        {eventsQuery.isSuccess && upcoming.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={favoriteIds.has(event.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      {categoriesQuery.isSuccess && categories.length > 0 && (
        <section
          aria-label="Explorar por categoría"
          className="border-y border-slate-200 bg-white px-6 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Por intereses
                </p>
                <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  Explora por categoría
                </h2>
              </div>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => {
                const count = eventsByCategory.get(category.id) ?? 0;
                return (
                  <Link
                    key={category.id}
                    to={`/events?categoryId=${category.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <LayoutGrid className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-slate-900">
                        {category.name}
                      </span>
                      <span className="block text-sm text-slate-500">
                        {count} {count === 1 ? "evento" : "eventos"}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              ¿Por qué elegir PlanCity?
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
              Tu compañero perfecto para eventos
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold sm:text-5xl">
            ¿Listo para empezar?
          </h2>

          <p className="mt-6 text-xl text-indigo-100">
            Únete a miles de usuarios que ya descubren sus eventos favoritos en PlanCity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition hover:bg-slate-50"
            >
              Crear cuenta
            </Link>

            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Ver eventos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
