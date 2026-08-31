import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      if (!id) {
        setError("Categoría no encontrada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await categoryService.getById(id);
        setCategory(data);
      } catch {
        setError("No se pudo cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500">Cargando categoría...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p role="alert" className="text-red-600">{error}</p>
          <Link
            to="/categories"
            className="mt-5 inline-block font-semibold text-indigo-600"
          >
            ← Volver a categorías
          </Link>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Categoría no encontrada.</p>
          <Link
            to="/categories"
            className="mt-5 inline-block font-semibold text-indigo-600"
          >
            ← Volver a categorías
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/categories"
          className="mb-8 inline-flex items-center font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          ← Volver a categorías
        </Link>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-600">
            ✦
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Categoría
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {category.description}
          </p>
        </article>
      </div>
    </main>
  );
}