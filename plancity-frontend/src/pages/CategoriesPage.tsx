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

    if (!confirmed) {
      return;
    }

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
    return <p>Cargando categorías...</p>;
  }

  if (error && categories.length === 0) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main>
      <h1>Categorías</h1>

      {user?.role === "admin" && (
        <Link to="/admin/categories/new">
          Crear categoría
        </Link>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

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

              {user?.role === "admin" && (
                <div>
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(category.id)
                    }
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
