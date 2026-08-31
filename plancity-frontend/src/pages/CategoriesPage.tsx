import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";

export function CategoriesPage() {
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

  if (loading) {
    return <p>Cargando categorías...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main>
      <h1>Categorías</h1>

      {categories.length === 0 ? (
        <p>No hay categorías disponibles.</p>
      ) : (
        <section>
          {categories.map((category) => (
            <article key={category.id}>
              <h2>{category.name}</h2>

              <p>{category.description}</p>

              <Link to={`/categories/${category.id}`}>
                Ver categoría
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}