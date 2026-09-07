# PlanCity — Frontend

SPA para descubrimiento y gestión de eventos: catálogo con búsqueda y filtros,
detalle con relacionados, categorías, favoritos optimistas, autenticación JWT y
administración de eventos/categorías. Consume la API de `plancity-api/`.

## Stack

| Área | Tecnología | Versión |
|---|---|---|
| UI | React + React DOM | 19.2.8 |
| Lenguaje | TypeScript | 6.0.3 |
| Build | Vite | 8.2.2 |
| Estilos | Tailwind CSS | 4.3.3 |
| Rutas | React Router DOM | 7.18.3 |
| HTTP + caché | Axios + TanStack Query | 1.20.0 / 5.102.8 |
| Formularios | React Hook Form + Zod | 7.87.0 / 4.5.4 |
| Iconos / avisos | lucide-react + sonner | 1.41.0 / 2.0.8 |
| Pruebas | Vitest + Testing Library | 4.1.11 |

## Estructura (`src/`, 60 archivos)

```text
api/         client (Axios + interceptor JWT), request, queryClient
components/  ui/ (sistema de diseño), EventCard, Navbar, common
context/     AuthContext (sesión con restauración) + useAuth
hooks/       useEventsQuery (8 queries/mutaciones), useDebounce, useDocumentTitle
layouts/     MainLayout (Navbar + Footer + Toaster + skip-link)
pages/       9 vistas + admin/ (formularios evento/categoría)
routes/      AppRouter (lazy por ruta), ProtectedRoute, AdminRoute
schemas/     forms.ts — Zod espejo exacto de los DTOs del backend
services/    auth, category, event, favorite (Axios por dominio)
types/       contratos Event, Category, User, Auth
utils/       cn, errors (mensajes 409/404), formatters (COP, fecha es-CO)
```

## Contrato con la API (restricciones reales)

- Listado servidor: solo `search` + `categoryId`, arreglo completo ordenado por fecha
  ASC, **sin paginación** → filtros extra y “Ver más” se resuelven en cliente.
- `DELETE` responde `204` sin cuerpo. Errores controlados: `400` (validación),
  `401` (limpia sesión), `403` (solo admin), `404`, `409` (duplicados).
- `VITE_API_URL` apunta a la API (por defecto `http://localhost:3000`).

## Scripts

```bash
npm run dev          # desarrollo (http://localhost:5173)
npm run build        # tsc + build producción (code-splitting por ruta)
npm run lint         # ESLint
npm run test:run     # Vitest (35 pruebas)
npx tsc --noEmit     # verificación de tipos
```

## Rutas

`/` · `/events` (+`?search=`, `?categoryId=`) · `/events/:id` · `/categories` ·
`/categories/:id` · `/login` · `/register` · `/favorites` (protegida) ·
`/admin/events|/categories/...` (solo admin) · `*` → NotFound.

## Historial de modernización

Fases 1–5: base UI y design tokens → datos con Query y rediseño de vistas →
formularios RHF+Zod → home funcional y navbar responsive → lazy, a11y (skip-link,
ARIA) y SEO (títulos por ruta, `lang="es"`). Detalle de decisiones en
`plancity-api/README.frontend.md`.
