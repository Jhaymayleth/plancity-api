import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Field } from "../../components/ui/Field";
import { fieldInputClassName } from "../../components/ui/inputStyles";
import { Spinner } from "../../components/ui/Spinner";
import {
  useCategoriesQuery,
  useEventQuery,
  useSaveEventMutation,
} from "../../hooks/useEventsQuery";
import { eventSchema, type EventFormData } from "../../schemas/forms";
import { getErrorMessage } from "../../utils/errors";
import type { EventData } from "../../types/event";

const MAX_IMAGES = 10;

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const categoriesQuery = useCategoriesQuery();
  const eventQuery = useEventQuery(id);
  const saveMutation = useSaveEventMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      location: "",
      price: 0,
      capacity: 1,
      categoryId: "",
      images: [{ url: "" }],
    },
  });

  const {
    fields: imageFields,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  // RHF recomienda reset() para hidratar el formulario en edición.
  useEffect(() => {
    if (eventQuery.data) {
      const event = eventQuery.data;
      reset({
        name: event.name,
        description: event.description ?? "",
        date: formatDateForInput(event.date),
        location: event.location,
        price: event.price,
        capacity: event.capacity,
        categoryId: event.categoryId,
        images:
          event.images.length > 0
            ? [...event.images]
                .sort((a, b) => a.order - b.order)
                .map((image) => ({ url: image.url }))
            : [{ url: "" }],
      });
    }
  }, [eventQuery.data, reset]);

  const onSubmit = (data: EventFormData) => {
    const payload: EventData = {
      name: data.name,
      description: data.description ?? "",
      date: new Date(data.date).toISOString(),
      location: data.location,
      price: data.price,
      capacity: data.capacity,
      categoryId: data.categoryId,
      images: data.images
        .map((image) => image.url.trim())
        .filter((url) => url !== ""),
    };

    saveMutation.mutate(
      { id, data: payload },
      { onSuccess: () => navigate("/events") },
    );
  };

  if (isEditing && eventQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <p className="flex items-center gap-2 text-lg font-medium text-slate-500">
          <Spinner /> Cargando evento...
        </p>
      </main>
    );
  }

  if (isEditing && eventQuery.isError) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {getErrorMessage(eventQuery.error, "No se pudo cargar el evento.")}
          </p>
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => eventQuery.refetch()}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reintentar
            </button>
            <Link
              to="/events"
              className="font-semibold text-slate-600 hover:text-indigo-600"
            >
              ← Volver a eventos
            </Link>
          </div>
        </div>
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
          <div className="mb-8 border-b border-slate-200 pb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Administración
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {isEditing ? "Editar evento" : "Nuevo evento"}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Nombre del evento"
                htmlFor="name"
                error={errors.name?.message}
                className="md:col-span-2"
              >
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={fieldInputClassName(Boolean(errors.name))}
                  placeholder="Ej. Festival de música"
                />
              </Field>

              <Field
                label="Descripción"
                htmlFor="description"
                error={errors.description?.message}
                className="md:col-span-2"
              >
                <textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                  className={fieldInputClassName(Boolean(errors.description))}
                  placeholder="Describe la experiencia, el público y la propuesta del evento..."
                />
              </Field>

              <Field label="Fecha y hora" htmlFor="date" error={errors.date?.message}>
                <input
                  id="date"
                  type="datetime-local"
                  {...register("date")}
                  className={fieldInputClassName(Boolean(errors.date))}
                />
              </Field>

              <Field
                label="Ubicación"
                htmlFor="location"
                error={errors.location?.message}
              >
                <input
                  id="location"
                  type="text"
                  {...register("location")}
                  className={fieldInputClassName(Boolean(errors.location))}
                  placeholder="Ej. Parque de la 93, Bogotá"
                />
              </Field>

              <Field
                label="Precio (0 = gratis)"
                htmlFor="price"
                error={errors.price?.message}
              >
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className={fieldInputClassName(Boolean(errors.price))}
                />
              </Field>

              <Field
                label="Capacidad"
                htmlFor="capacity"
                error={errors.capacity?.message}
              >
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  step="1"
                  {...register("capacity", { valueAsNumber: true })}
                  className={fieldInputClassName(Boolean(errors.capacity))}
                />
              </Field>

              <Field
                label="Categoría"
                htmlFor="category"
                error={
                  errors.categoryId?.message ??
                  (categoriesQuery.isError
                    ? "No se pudieron cargar las categorías."
                    : undefined)
                }
                className="md:col-span-2"
              >
                <select
                  id="category"
                  {...register("categoryId")}
                  className={fieldInputClassName(Boolean(errors.categoryId))}
                >
                  <option value="">Selecciona una categoría</option>
                  {(categoriesQuery.data ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-700">
                Imágenes (máx. {MAX_IMAGES})
              </legend>

              <div className="mt-4 space-y-4">
                {imageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-end"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor={`images.${index}.url`}
                        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        URL de imagen {index + 1}
                      </label>
                      <input
                        id={`images.${index}.url`}
                        type="url"
                        {...register(`images.${index}.url` as const)}
                        placeholder="https://..."
                        className={fieldInputClassName(
                          Boolean(errors.images?.[index]?.url),
                        )}
                      />
                      {errors.images?.[index]?.url?.message && (
                        <p role="alert" className="mt-1.5 text-sm text-red-600">
                          {errors.images[index]?.url?.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        imageFields.length > 1
                          ? removeImage(index)
                          : setValue("images", [{ url: "" }])
                      }
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {typeof errors.images?.message === "string" && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {errors.images.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => addImage({ url: "" })}
                disabled={imageFields.length >= MAX_IMAGES}
                className="mt-4 inline-flex rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Agregar imagen
              </button>
            </fieldset>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                to="/events"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || saveMutation.isPending}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saveMutation.isPending
                  ? "Guardando..."
                  : isEditing
                    ? "Actualizar evento"
                    : "Crear evento"}
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
