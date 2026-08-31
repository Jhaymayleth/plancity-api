import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { categoryService } from "../../services/categoryService";

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar categoría cuando estamos editando
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const category = await categoryService.getById(id);

        setName(category.name);
        setDescription(category.description);
      } catch {
        setError("No se pudo cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        name,
        description,
      };

      if (isEditing && id) {
        await categoryService.update(id, data);
      } else {
        await categoryService.create(data);
      }

      navigate("/categories");
    } catch {
      setError(
        isEditing
          ? "No se pudo actualizar la categoría."
          : "No se pudo crear la categoría.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Cargando categoría...</h1>
      </main>
    );
  }

  return (
    <main>
      <Link to="/categories">
        ← Volver a categorías
      </Link>

      <h1>
        {isEditing
          ? "Editar categoría"
          : "Nueva categoría"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Nombre
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Descripción
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />
        </div>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Guardando..."
            : isEditing
              ? "Actualizar categoría"
              : "Crear categoría"}
        </button>
      </form>
    </main>
  );
}
