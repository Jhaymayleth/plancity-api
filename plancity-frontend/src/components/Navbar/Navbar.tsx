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
    <nav>
      <Link to="/">PlanCity</Link>

      <div>
        <Link to="/events">Eventos</Link>
        <Link to="/categories">Categorías</Link>

        {user && <Link to="/favorites">Mis favoritos</Link>}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/events/new">Crear evento</Link>
            <Link to="/admin/categories/new">
              Crear categoría
            </Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span>
              Hola, {user.name}
            </span>

            <button type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}