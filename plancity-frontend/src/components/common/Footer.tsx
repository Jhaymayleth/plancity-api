import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>
          <span className="font-bold text-slate-900">PlanCity</span> — Descubre
          tu próximo evento.
        </p>
        <nav className="flex gap-4" aria-label="Enlaces de pie de página">
          <Link className="hover:text-slate-900" to="/events">
            Eventos
          </Link>
          <Link className="hover:text-slate-900" to="/categories">
            Categorías
          </Link>
          <Link className="hover:text-slate-900" to="/favorites">
            Favoritos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
