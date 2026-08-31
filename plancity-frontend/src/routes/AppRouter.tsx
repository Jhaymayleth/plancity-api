import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Navbar } from "../components/Navbar/Navbar";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

import { HomePage } from "../pages/HomePage";
import { EventsPage } from "../pages/EventsPage";
import { EventDetailPage } from "../pages/EventDetailPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { CategoryDetailPage } from "../pages/CategoryDetailPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

import { CategoryFormPage } from "../pages/admin/CategoryFormPage";
import { EventFormPage } from "../pages/admin/EventFormPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/events" element={<EventsPage />} />

        <Route
          path="/events/:id"
          element={<EventDetailPage />}
        />

        <Route
          path="/categories"
          element={<CategoriesPage />}
        />

        <Route
          path="/categories/:id"
          element={<CategoryDetailPage />}
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />
        </Route>

        <Route element={<AdminRoute />}>
          <Route
            path="/admin/categories/new"
            element={<CategoryFormPage />}
          />

          <Route
            path="/admin/categories/:id/edit"
            element={<CategoryFormPage />}
          />

          <Route
            path="/admin/events/new"
            element={<EventFormPage />}
          />

          <Route
            path="/admin/events/:id/edit"
            element={<EventFormPage />}
          />
        </Route>

        <Route
          path="*"
          element={<p>Página no encontrada</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}