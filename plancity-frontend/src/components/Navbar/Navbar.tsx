import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, Plus, Ticket, X } from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { cn } from "../../utils/cn";

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-100 text-slate-900"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
        Inicio
      </NavLink>

      <NavLink to="/events" className={navLinkClass} onClick={() => setOpen(false)}>
        Eventos
      </NavLink>

      <NavLink
        to="/categories"
        className={navLinkClass}
        onClick={() => setOpen(false)}
      >
        Categorías
      </NavLink>

      {user && (
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            cn(navLinkClass({ isActive }), "inline-flex items-center gap-1.5")
          }
          onClick={() => setOpen(false)}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Mis favoritos
        </NavLink>
      )}

      {user?.role === "admin" && (
        <>
          <NavLink
            to="/admin/events/new"
            className={({ isActive }) =>
              cn(navLinkClass({ isActive }), "inline-flex items-center gap-1 text-blue-600 hover:text-blue-700")
            }
            onClick={() => setOpen(false)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear evento
          </NavLink>

          <NavLink
            to="/admin/categories/new"
            className={({ isActive }) =>
              cn(navLinkClass({ isActive }), "inline-flex items-center gap-1 text-blue-600 hover:text-blue-700")
            }
            onClick={() => setOpen(false)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear categoría
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition hover:text-blue-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Ticket className="h-5 w-5" aria-hidden="true" />
          </span>

          <span>
            Plan<span className="text-blue-600">City</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">{links}</div>

        <div className="flex items-center gap-2">
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
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:inline-flex"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
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

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">{links}</div>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 sm:hidden"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}
