import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_25px_80px_rgba(15,23,42,0.12)] sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-4xl shadow-inner shadow-indigo-200/60">
          404
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
          Página no encontrada
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Esta ruta no existe
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          La página que buscas no está disponible o fue movida. Regresa al inicio y sigue descubriendo eventos increíbles.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600"
          >
            Volver al inicio
          </Link>
          <Link
            to="/events"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Explorar eventos
          </Link>
        </div>
      </div>
    </main>
  );
}