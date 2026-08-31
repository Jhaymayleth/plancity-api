import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { categoryService } from "../../services/categoryService";
import { eventService } from "../../services/eventService";

import type { Category } from "../../types/category";

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([""]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();

        setCategories(data);

        if (!isEditing && data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch {
        setError("No se pudieron cargar las categorías.");
      }
    };

    loadCategories();
  }, [isEditing]);

  // Cargar evento cuando estamos editando
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const event = await eventService.getById(id);

        setName(event.name);
        setDescription(event.description);

        // datetime-local necesita este formato
        setDate(formatDateForInput(event.date));

        setLocation(event.location);
        setPrice(String(event.price));
        setCapacity(String(event.capacity));
        setCategoryId(event.categoryId);

        setImages(
          event.images.length > 0
            ? event.images
                .sort((a, b) => a.order - b.order)
                .map((image) => image.url)
            : [""],
        );
      } catch {
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleImageChange = (
    index: number,
    value: string,
  ) => {
    setImages((currentImages) =>
      currentImages.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addImageField = () => {
    setImages((currentImages) => [
      ...currentImages,
      "",
    ]);
  };

  const removeImageField = (index: number) => {
    setImages((currentImages) => {
      const nextImages = currentImages.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return nextImages.length > 0 ? nextImages : [""];
    });
  };

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
        date: new Date(date).toISOString(),
        location,
        price: Number(price),
        capacity: Number(capacity),
        categoryId,
        images: images.filter(
          (image) => image.trim() !== "",
        ),
      };

      if (isEditing && id) {
        await eventService.update(id, data);
      } else {
        await eventService.create(data);
      }

      navigate("/events");
    } catch {
      setError(
        isEditing
          ? "No se pudo actualizar el evento."
          : "No se pudo crear el evento.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Cargando evento...</h1>
      </main>
    );
  }

  return (
    <main>
      <Link to="/events">
        ← Volver a eventos
      </Link>

      <h1>
        {isEditing
          ? "Editar evento"
          : "Nuevo evento"}
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

        <div>
          <label htmlFor="date">
            Fecha
          </label>

          <input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="location">
            Ubicación
          </label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="price">
            Precio
          </label>

          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="capacity">
            Capacidad
          </label>

          <input
            id="capacity"
            type="number"
            min="1"
            value={capacity}
            onChange={(event) =>
              setCapacity(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="category">
            Categoría
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            required
          >
            <option value="">
              Selecciona una categoría
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend>Imágenes</legend>

          {images.map((image, index) => (
            <div key={index}>
              <label htmlFor={`image-${index}`}>
                URL de imagen {index + 1}
              </label>

              <input
                id={`image-${index}`}
                type="url"
                value={image}
                onChange={(event) =>
                  handleImageChange(
                    index,
                    event.target.value,
                  )
                }
                placeholder="https://..."
              />

              <button
                type="button"
                onClick={() =>
                  removeImageField(index)
                }
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addImageField}
          >
            Agregar imagen
          </button>
        </fieldset>

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
              ? "Actualizar evento"
              : "Crear evento"}
        </button>
      </form>
    </main>
  );
}

function formatDateForInput(date: string) {
  const parsedDate = new Date(date);

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    parsedDate.getDate(),
  ).padStart(2, "0");
  const hours = String(
    parsedDate.getHours(),
  ).padStart(2, "0");
  const minutes = String(
    parsedDate.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
