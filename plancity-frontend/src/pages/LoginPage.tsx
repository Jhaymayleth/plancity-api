import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link, useNavigate } from "react-router-dom";

import { Field } from "../components/ui/Field";
import { fieldInputClassName } from "../components/ui/inputStyles";
import { useAuth } from "../context/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/forms";
import { getErrorMessage } from "../utils/errors";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      await login(data);
      navigate("/");
    } catch (error) {
      setServerError(
        getErrorMessage(error, "Correo o contraseña incorrectos."),
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white md:block">
          <Link to="/" className="text-2xl font-bold">
            PlanCity
          </Link>

          <div className="mt-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Bienvenido de nuevo
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Tu próximo plan está esperando.
            </h2>

            <p className="mt-6 leading-relaxed text-indigo-100">
              Inicia sesión para guardar tus eventos favoritos y disfrutar
              una experiencia personalizada.
            </p>
          </div>
        </section>

        <section className="p-8 sm:p-12">
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 md:hidden"
          >
            PlanCity
          </Link>

          <h1 className="mt-8 text-3xl font-bold text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-slate-500">
            Ingresa tus datos para continuar.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 space-y-5"
          >
            <Field label="Correo" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={fieldInputClassName(Boolean(errors.email))}
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
                autoComplete="current-password"
                {...register("password")}
                className={fieldInputClassName(Boolean(errors.password))}
              />
            </Field>

            {serverError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Registrarse
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
