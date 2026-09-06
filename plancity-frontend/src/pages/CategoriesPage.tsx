import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";

export function CategoriesPage() {
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await categoryService.getAll();
        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta categoría?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await categoryService.remove(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== categoryId,
        ),
      );
    } catch {
      setError("No se pudo eliminar la categoría.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-500">
          Cargando categorías...
        </p>
      </main>
    );
  }

  if (error && categories.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600"
        >
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Explora PlanCity
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Categorías
            </h1>

            <p className="mt-3 max-w-xl text-lg text-slate-600">
              Encuentra experiencias según tus intereses y descubre qué está pasando.
            </p>
          </div>

          {user?.role === "admin" && (
            <Link
              to="/admin/categories/new"
              className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-600"
            >
              + Crear categoría
            </Link>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600"
          >
            {error}
          </p>
        )}

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-500">
              No hay categorías disponibles.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="group flex min-h-60 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                  ✦
                </div>

                <h2 className="text-xl font-bold">
                  {category.name}
                </h2>

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
                        onClick={() => handleDelete(category.id)}
                        className="font-medium text-red-500 transition hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}