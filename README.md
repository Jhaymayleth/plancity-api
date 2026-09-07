# PlanCity — Monorepo (API + Frontend)

Plataforma de descubrimiento y gestión de eventos: categorías, eventos, favoritos,
autenticación JWT con roles (`admin` / `user`).

## Estructura

```text
entrega/
├── plancity-api/          # API REST NestJS 11 + TypeORM + PostgreSQL + JWT + Swagger
│   └── README.md          # Documentación de la API
├── plancity-frontend/     # SPA React 19 + TypeScript + Vite + Tailwind + Router + Axios
│   └── README.md          # Documentación del frontend
├── evidencias/            # Documentos Word 220501095/220501096 + diagramas + capturas + SQL
└── GUIA PARA PRESENTAR EVIDENCIA DE PRODUCTO (1).pdf
```

## Contrato API (resumen)

- `GET /events?search=&categoryId=` público, arreglo completo ordenado por fecha ASC, sin paginación.
- `GET /events/:id` público. `POST/PATCH/DELETE /events` solo `admin` (`DELETE` → `204`).
- `GET /categories`, `GET /categories/:id` públicos; escritura solo `admin`.
- `GET /favorites`, `POST /favorites/:eventId`, `DELETE /favorites/:eventId` requieren JWT.
- `POST /auth/register` (auto-login), `POST /auth/login`, `POST /auth/logout` (stateless),
  `GET /users/me`, `PATCH /users/me/password`.
- Detalle completo en `plancity-api/README.md` y Swagger (`/api` con la API en ejecución).

## Puesta en marcha

```bash
# API
cd plancity-api
cp .env.example .env   # configurar DATABASE_URL y JWT_SECRET
npm install
npm run migration:run
npm run start:dev

# Frontend (otra terminal)
cd plancity-frontend
cp .env.example .env   # configurar VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

## Calidad

```bash
# Frontend
cd plancity-frontend
npx tsc --noEmit && npm run lint && npm run test:run && npm run build

# API
cd plancity-api
npm run lint && npm test && npm run build
```

## Estado

Frontend modernizado en 5 fases (ver `plancity-frontend/README.md`):

1. **Base UI**: design tokens, `components/ui` (Button, Badge, Skeleton, EmptyState,
   ConfirmDialog...), `MainLayout`+`Footer`+`Toaster`, `useDebounce`, formatos COP/fecha.
2. **Datos**: TanStack Query (caché 30 s), favorito optimista con toasts 409/404,
   debounce 300 ms, skeletons, `ConfirmDialog`, detalle con compartir y relacionados.
3. **Formularios**: RHF + Zod espejo exacto de los DTOs (login, registro, evento, categoría).
4. **Vistas**: home con buscador funcional, categorías con conteo, navbar responsive,
   `NotFound` en ruta `*`, filtros iniciales por `?search=` y `?categoryId=`.
5. **Rendimiento/a11y/SEO**: lazy por ruta (inicial 337 kB), skip-link, títulos por
   página, `lang="es"` + metadatos.

Verificado: `tsc` limpio, `ESLint` limpio, **35/35 tests Vitest**, `build` ok en ambas fases.
Los filtros fuera de `search`+`categoryId` y la paginación se resuelven en cliente
porque la API no los expone en servidor (restricción documentada, no deuda).

## Evidencias SENA (ECCL)

En `evidencias/`: documentos Word diligenciados para las normas **220501095**
(diseño, UML, prototipo, modelo BD) y **220501096** (técnico, instructivo, solución),
con diagramas fuente (PlantUML/Mermaid) + PNG, capturas del sistema y
`plancity-schema.sql`. Ver `evidencias/README.md`.
