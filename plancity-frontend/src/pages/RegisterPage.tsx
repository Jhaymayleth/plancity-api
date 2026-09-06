import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Field } from "../components/ui/Field";
import { fieldInputClassName } from "../components/ui/inputStyles";
import { useAuth } from "../context/useAuth";
import { registerSchema, type RegisterFormData } from "../schemas/forms";
import { getErrorMessage } from "../utils/errors";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: signup } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");

    try {
      await signup(data);
      navigate("/");
    } catch (error) {
      setServerError(
        getErrorMessage(error, "No se pudo crear la cuenta."),
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-50 px-6 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] md:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white md:flex md:flex-col md:justify-between">
          <div>
            <Link to="/" className="text-2xl font-black tracking-tight">
              PlanCity
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-200">
              Únete a PlanCity
            </p>
            <h2 className="mt-4 max-w-sm text-4xl font-black leading-tight">
              Descubre experiencias que encajan contigo.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-indigo-100">
              Crea tu cuenta para guardar favoritos, seguir eventos y encontrar planes increíbles cerca de ti.
            </p>
          </div>

          <div className="mt-8 flex gap-3 text-sm text-indigo-100">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              + 1,200 eventos
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              Acceso rápido
            </span>
          </div>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <Link to="/" className="text-xl font-black text-indigo-600 md:hidden">
            PlanCity
          </Link>

          <div className="mt-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Registro
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Crear cuenta
            </h1>
            <p className="mt-2 text-slate-500">
              Empieza a descubrir experiencias cerca de ti.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 space-y-5"
          >
            <Field label="Nombre" htmlFor="name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                className={fieldInputClassName(Boolean(errors.name))}
                placeholder="Tu nombre completo"
              />
            </Field>

            <Field
              label="Correo electrónico"
              htmlFor="email"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={fieldInputClassName(Boolean(errors.email))}
                placeholder="tu@email.com"
              />
            </Field>

            <Field
              label="Contraseña"
              htmlFor="password"
              error={errors.password?.message}
            >
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className={fieldInputClassName(Boolean(errors.password))}
                placeholder="••••••••"
              />
            </Field>

            {serverError && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 transition hover:text-indigo-800"
            >
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
