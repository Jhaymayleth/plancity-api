import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";
import { Spinner } from "../components/ui/Spinner";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

// Code-splitting por ruta: el bundle inicial solo trae el layout;
// cada página viaja en su propio chunk (ver dist/ tras el build).
const HomePage = lazy(() =>
  import("../pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const EventsPage = lazy(() =>
  import("../pages/EventsPage").then((module) => ({
    default: module.EventsPage,
  })),
);
const EventDetailPage = lazy(() =>
  import("../pages/EventDetailPage").then((module) => ({
    default: module.EventDetailPage,
  })),
);
const CategoriesPage = lazy(() =>
  import("../pages/CategoriesPage").then((module) => ({
    default: module.CategoriesPage,
  })),
);
const CategoryDetailPage = lazy(() =>
  import("../pages/CategoryDetailPage").then((module) => ({
    default: module.CategoryDetailPage,
  })),
);
const FavoritesPage = lazy(() =>
  import("../pages/FavoritesPage").then((module) => ({
    default: module.FavoritesPage,
  })),
);
const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const CategoryFormPage = lazy(() =>
  import("../pages/admin/CategoryFormPage").then((module) => ({
    default: module.CategoryFormPage,
  })),
);
const EventFormPage = lazy(() =>
  import("../pages/admin/EventFormPage").then((module) => ({
    default: module.EventFormPage,
  })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="flex items-center gap-2 text-slate-500">
        <Spinner /> Cargando página...
      </p>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/events" element={<EventsPage />} />

            <Route path="/events/:id" element={<EventDetailPage />} />

            <Route path="/categories" element={<CategoriesPage />} />

            <Route path="/categories/:id" element={<CategoryDetailPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/favorites" element={<FavoritesPage />} />
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

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
