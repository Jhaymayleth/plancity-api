import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/");
    } catch {
      setError("No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
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