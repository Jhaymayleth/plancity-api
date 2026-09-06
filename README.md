# PlanCity — Monorepo (API + Frontend)

Plataforma de descubrimiento y gestión de eventos: categorías, eventos, favoritos,
autenticación JWT con roles (`admin` / `user`).

## Estructura

```text
entrega/
├── plancity-api/          # API REST NestJS 11 + TypeORM + PostgreSQL + JWT + Swagger
│   ├── README.md          # Documentación de la API
│   └── README.frontend.md # Documento de decisiones técnicas del frontend
├── plancity-frontend/     # SPA React 19 + TypeScript + Vite + Tailwind + Router + Axios
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

Fase 1 base UI aplicada en el frontend (design tokens, `components/ui`,
`MainLayout`+`Footer`+`Toaster`, `useDebounce`, formatos COP/fecha).
Los filtros avanzados fuera de `search`+`categoryId` se resuelven en cliente
porque la API no los expone en servidor.
