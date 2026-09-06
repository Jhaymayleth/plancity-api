import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 lg:flex-nowrap lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition hover:text-blue-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm shadow-blue-200">
            P
          </span>

          <span>
            Plan<span className="text-blue-600">City</span>
          </span>
        </Link>

        <div className="order-3 flex w-full items-center gap-1 overflow-x-auto text-sm font-medium text-slate-600 sm:w-auto lg:order-2">
          <Link
            to="/"
            className="whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Inicio
          </Link>

          <Link
            to="/events"
            className="whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Eventos
          </Link>

          <Link
            to="/categories"
            className="whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Categorías
          </Link>

          {user && (
            <Link
              to="/favorites"
              className="whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Mis favoritos
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/events/new"
                className="whitespace-nowrap rounded-lg px-3 py-2 text-blue-600 transition hover:bg-blue-50"
              >
                Crear evento
              </Link>

              <Link
                to="/admin/categories/new"
                className="whitespace-nowrap rounded-lg px-3 py-2 text-blue-600 transition hover:bg-blue-50"
              >
                Crear categoría
              </Link>
            </>
          )}
        </div>

        <div className="order-2 flex items-center gap-2 lg:order-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-500 md:inline">
                Hola,{" "}
                <strong className="font-semibold text-slate-800">
                  {user.name}
                </strong>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}