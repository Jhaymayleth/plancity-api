import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Field } from "../../components/ui/Field";
import { fieldInputClassName } from "../../components/ui/inputStyles";
import { Spinner } from "../../components/ui/Spinner";
import {
  useCategoryQuery,
  useSaveCategoryMutation,
} from "../../hooks/useEventsQuery";
import { categorySchema, type CategoryFormData } from "../../schemas/forms";
import { getErrorMessage } from "../../utils/errors";

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const categoryQuery = useCategoryQuery(id);
  const saveMutation = useSaveCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  // RHF recomienda reset() para hidratar el formulario en edición.
  useEffect(() => {
    if (categoryQuery.data) {
      reset({
        name: categoryQuery.data.name,
        description: categoryQuery.data.description ?? "",
      });
    }
  }, [categoryQuery.data, reset]);

  const onSubmit = (data: CategoryFormData) => {
    saveMutation.mutate(
      {
        id,
        data: { name: data.name, description: data.description ?? "" },
      },
      { onSuccess: () => navigate("/categories") },
    );
  };

  if (isEditing && categoryQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <p className="flex items-center gap-2 text-lg font-medium text-slate-500">
          <Spinner /> Cargando categoría...
        </p>
      </main>
    );
  }

  if (isEditing && categoryQuery.isError) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {getErrorMessage(
              categoryQuery.error,
              "No se pudo cargar la categoría.",
            )}
          </p>
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => categoryQuery.refetch()}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reintentar
            </button>
            <Link
              to="/categories"
              className="font-semibold text-slate-600 hover:text-indigo-600"
            >
              ← Volver a categorías
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/categories"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          ← Volver a categorías
        </Link>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {isEditing ? "Editar categoría" : "Nueva categoría"}
              </h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <Field label="Nombre" htmlFor="name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={fieldInputClassName(Boolean(errors.name))}
                placeholder="Ej. Música en vivo"
              />
            </Field>

            <Field
              label="Descripción"
              htmlFor="description"
              error={errors.description?.message}
            >
              <textarea
                id="description"
                rows={5}
                {...register("description")}
                className={fieldInputClassName(Boolean(errors.description))}
                placeholder="Describe la categoría y qué tipo de eventos incluye..."
              />
            </Field>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                to="/categories"
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
                    ? "Actualizar categoría"
                    : "Crear categoría"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
