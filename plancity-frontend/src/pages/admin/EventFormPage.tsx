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

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const event = await eventService.getById(id);

        setName(event.name);
        setDescription(event.description);
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

  const handleImageChange = (index: number, value: string) => {
    setImages((currentImages) =>
      currentImages.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addImageField = () => {
    setImages((currentImages) => [...currentImages, ""]);
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
        images: images.filter((image) => image.trim() !== ""),
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <p className="text-lg font-medium text-slate-500">Cargando evento...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          ← Volver a eventos
        </Link>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {isEditing ? "Editar evento" : "Nuevo evento"}
              </h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
              🎟️
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre del evento
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="Ej. Festival de música"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="Describe la experiencia, el público y la propuesta del evento..."
                />
              </div>

              <div>
                <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">
                  Fecha y hora
                </label>
                <input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">
                  Ubicación
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="Ej. Plaza Mayor, Madrid"
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-semibold text-slate-700">
                  Precio
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="mb-2 block text-sm font-semibold text-slate-700">
                  Capacidad
                </label>
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                  Categoría
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-700">Imágenes</legend>

              <div className="mt-4 space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor={`image-${index}`} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        URL de imagen {index + 1}
                      </label>
                      <input
                        id={`image-${index}`}
                        type="url"
                        value={image}
                        onChange={(event) => handleImageChange(index, event.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageField}
                className="mt-4 inline-flex rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                + Agregar imagen
              </button>
            </fieldset>

            {error && (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                to="/events"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Guardando..." : isEditing ? "Actualizar evento" : "Crear evento"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function formatDateForInput(date: string) {
  const parsedDate = new Date(date);

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
