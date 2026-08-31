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
    return <p>Cargando categoría...</p>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/categories">Volver a categorías</Link>
      </main>
    );
  }

  if (!category) {
    return (
      <main>
        <p>Categoría no encontrada.</p>
        <Link to="/categories">Volver a categorías</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/categories">← Volver a categorías</Link>

      <article>
        <h1>{category.name}</h1>

        <p>{category.description}</p>
      </article>
    </main>
  );
}