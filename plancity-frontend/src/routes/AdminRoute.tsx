import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}