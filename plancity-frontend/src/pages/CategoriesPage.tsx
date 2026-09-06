import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

import {
  ConfirmDialog,
  EmptyState,
  SectionHeader,
  Skeleton,
} from "../components/ui";
import { useAuth } from "../context/useAuth";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
  useEventsQuery,
} from "../hooks/useEventsQuery";

export function CategoriesPage() {
  const { user } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const categoriesQuery = useCategoriesQuery();
  const eventsQuery = useEventsQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const eventsByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of eventsQuery.data ?? []) {
      counts.set(event.categoryId, (counts.get(event.categoryId) ?? 0) + 1);
    }
    return counts;
  }, [eventsQuery.data]);

  const pendingDeleteCategory = useMemo(
    () => categories.find((category) => category.id === pendingDeleteId) ?? null,
    [categories, pendingDeleteId],
  );

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => setPendingDeleteId(null),
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Explora PlanCity"
          title="Categorías"
          description="Encuentra experiencias según tus intereses y descubre qué está pasando."
          action={
            user?.role === "admin" ? (
              <Link
                to="/admin/categories/new"
                className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-600"
              >
                + Crear categoría
              </Link>
            ) : undefined
          }
        />

        {categoriesQuery.isPending && (
          <section
            aria-label="Cargando categorías"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="mt-6 h-6 w-2/3" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
            ))}
          </section>
        )}

        {categoriesQuery.isError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600"
          >
            <p>No se pudieron cargar las categorías.</p>
            <button
              type="button"
              onClick={() => categoriesQuery.refetch()}
              className="mt-2 font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {categoriesQuery.isSuccess && categories.length === 0 && (
          <EmptyState
            title="No hay categorías disponibles"
            description="Vuelve pronto: estamos preparando nuevas categorías."
          />
        )}

        {categoriesQuery.isSuccess && categories.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = eventsByCategory.get(category.id) ?? 0;
              return (
                <article
                  key={category.id}
                  className="group flex min-h-60 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <LayoutGrid className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <h2 className="text-xl font-bold">{category.name}</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {count} {count === 1 ? "evento" : "eventos"}
                  </p>

                  <p className="mt-3 flex-1 leading-relaxed text-slate-600">
                    {category.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/categories/${category.id}`}
                      className="font-semibold text-indigo-600 transition hover:text-indigo-800"
                    >
                      Ver categoría →
                    </Link>

                    {user?.role === "admin" && (
                      <>
                        <Link
                          to={`/admin/categories/${category.id}/edit`}
                          className="font-medium text-slate-600 hover:text-slate-900"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(category.id)}
                          className="font-medium text-red-500 transition hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Eliminar categoría"
        description={
          pendingDeleteCategory
            ? `¿Estás seguro de que quieres eliminar "${pendingDeleteCategory.name}"? Si tiene eventos asociados, el servidor rechazará la eliminación.`
            : "¿Estás seguro de que quieres eliminar esta categoría?"
        }
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDeleteId(null)}
      />
    </main>
  );
}
