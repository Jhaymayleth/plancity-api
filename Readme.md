# PlanCity Frontend

Frontend de la aplicación **PlanCity**, desarrollado como parte de la prueba de desempeño del Módulo 5 de TypeScript.

El proyecto consume una API REST desarrollada previamente con NestJS y PostgreSQL, encargada de gestionar autenticación, usuarios, categorías, eventos y favoritos.

---

## 1. Objetivo del proyecto

Construir una interfaz web utilizando:

* React
* TypeScript
* Vite

que permita consumir la API de PlanCity y respetar las reglas de negocio definidas por el backend, especialmente las relacionadas con:

* Autenticación mediante JWT.
* Roles `user` y `admin`.
* Protección de rutas.
* Gestión de eventos.
* Gestión de categorías.
* Favoritos.
* Manejo de errores.
* Tipado estricto con TypeScript.

El desarrollo se realizó priorizando **funcionalidad, separación de responsabilidades y mantenibilidad** sobre la complejidad visual.

---

# Fase 0 — Preparación y decisiones iniciales

## 0.1 Análisis del backend

Antes de comenzar el desarrollo del frontend se verificó que la API estuviera funcionando correctamente mediante Swagger.

Base URL:

```text
http://localhost:3000
```

Documentación:

```text
http://localhost:3000/api/docs
```

Swagger permitió identificar:

* Endpoints disponibles.
* Métodos HTTP.
* Datos requeridos en cada petición.
* Estructura de las respuestas.
* Códigos HTTP utilizados por el backend.
* Requisitos de autenticación.
* Restricciones de rol.

### Decisión

Se decidió utilizar Swagger como **contrato de referencia entre frontend y backend**.

Esto evita desarrollar modelos o servicios basados en suposiciones y permite que el frontend respete las reglas que realmente implementa la API.

---

## 0.2 Validación de autenticación

Se probaron los endpoints:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /users/me
```

Se comprobó que el login devuelve:

```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

También se comprobó que los endpoints protegidos responden `401 Unauthorized` cuando no se proporciona un JWT.

### Decisión

El frontend tratará el `accessToken` como el mecanismo principal de autenticación y lo enviará mediante:

```http
Authorization: Bearer <token>
```

---

## 0.3 Validación de roles

Swagger permitió confirmar que determinadas operaciones requieren específicamente el rol `admin`.

Por ejemplo:

```text
POST   /categories    → admin
PATCH  /categories/:id → admin
DELETE /categories/:id → admin

POST   /events        → admin
PATCH  /events/:id    → admin
DELETE /events/:id    → admin
```

Mientras que:

```text
GET /events
GET /categories
GET /events/:id
GET /categories/:id
```

son operaciones públicas.

### Decisión

El frontend tendrá que implementar dos niveles de protección:

1. **Protección de interfaz:** ocultar acciones administrativas para usuarios normales.
2. **Protección de rutas:** impedir que un usuario `user` acceda directamente mediante una URL.

La segunda es especialmente importante porque ocultar botones por sí solo no constituye control de acceso.

---

# 0.4 Validación de modelos

Se utilizaron las respuestas reales del backend para definir posteriormente los tipos de TypeScript.

Por ejemplo, un evento devuelve información como:

```text
id
name
description
date
location
price
capacity
category
categoryId
images
createdAt
updatedAt
```

Además, se identificó una diferencia importante entre los datos enviados y los datos recibidos.

Para crear un evento el backend recibe:

```text
images: string[]
```

mientras que al devolver un evento proporciona objetos de imagen:

```text
images: EventImage[]
```

### Decisión

No se utilizará un único tipo para representar ambas situaciones.

Se diferenciarán:

* Modelos de respuesta.
* Datos utilizados para crear o actualizar recursos.

Esto permite que TypeScript represente correctamente el contrato de la API.

---

# 0.5 Creación del proyecto

El frontend fue creado utilizando Vite con React y TypeScript.

### Decisión: React + TypeScript + Vite

Esta combinación fue seleccionada porque corresponde directamente al stack solicitado por la prueba.

**React** permite construir la interfaz mediante componentes reutilizables.

**TypeScript** permite detectar errores de tipos durante el desarrollo y representar de forma explícita los contratos de la API.

**Vite** proporciona una configuración sencilla y un servidor de desarrollo rápido, evitando invertir tiempo innecesario en configuración durante una prueba con tiempo limitado.

---

# 0.6 Variables de entorno

Se configuró:

```env
VITE_API_URL=http://localhost:3000
```

La URL de la API no se escribió directamente dentro de los servicios.

### Decisión

Utilizar variables de entorno permite separar la configuración del código fuente.

Por ejemplo, posteriormente podría cambiarse:

```text
http://localhost:3000
```

por otra URL sin modificar los servicios del frontend.

El archivo `.env` se encuentra excluido mediante `.gitignore`, mientras que `.env.example` documenta las variables necesarias para ejecutar el proyecto.

---

# 0.7 Git

El frontend se integró al repositorio correspondiente al proyecto de la prueba.

Se mantuvo el seguimiento mediante Git desde el inicio para permitir:

* Registrar avances.
* Identificar cambios.
* Recuperar versiones anteriores.
* Mantener un historial claro de decisiones y funcionalidades.

El primer commit del frontend corresponde a la inicialización del proyecto.

---

# Fase 1 — Capa de comunicación con la API

El objetivo de esta fase fue construir una capa independiente entre los componentes de React y la API.

La estructura implementada es:

```text
src/
├── api/
│   ├── client.ts
│   └── request.ts
│
├── hooks/
│   └── useFetch.ts
│
├── services/
│   ├── authService.ts
│   ├── categoryService.ts
│   ├── eventService.ts
│   └── favoriteService.ts
│
└── types/
    ├── auth.ts
    ├── category.ts
    ├── event.ts
    └── user.ts
```

La intención es separar responsabilidades:

```text
Componentes
     ↓
Hooks
     ↓
Services
     ↓
request<T>
     ↓
Axios
     ↓
API
```

---

# 1.1 Elección de Axios

Se eligió **Axios** para la comunicación HTTP.

### ¿Por qué Axios?

La prueba permite utilizar `fetch` o Axios. Se eligió Axios principalmente por el uso de **interceptores**.

La aplicación necesita:

* Adjuntar automáticamente el JWT.
* Detectar respuestas `401`.
* Centralizar la configuración de las peticiones.

Axios permite resolver estas necesidades en un único cliente HTTP.

Esto evita repetir lógica como:

```text
Authorization: Bearer <token>
```

en cada servicio.

---

# 1.2 Cliente HTTP centralizado

Se creó:

```text
src/api/client.ts
```

Este archivo contiene una instancia centralizada de Axios.

Responsabilidades:

* Definir la `baseURL`.
* Configurar headers.
* Adjuntar el JWT.
* Reaccionar ante errores `401`.

### Interceptor de request

Antes de enviar una petición se consulta:

```text
localStorage
      ↓
accessToken
```

Si existe, se agrega:

```http
Authorization: Bearer <accessToken>
```

### Decisión

Centralizar esta lógica evita que cada servicio tenga que implementar manualmente la autenticación.

---

# 1.3 Manejo de 401

El interceptor de respuesta detecta:

```text
401 Unauthorized
```

Cuando ocurre, se elimina el `accessToken` almacenado localmente.

### ¿Por qué?

Un `401` indica que la sesión ya no puede considerarse válida para realizar la petición.

El error no se oculta:

```text
Promise.reject(error)
```

porque la capa superior todavía necesita recibirlo para mostrar feedback al usuario.

### Separación de responsabilidades

Se decidió que `client.ts` no debe encargarse directamente de la navegación.

Su responsabilidad es HTTP:

```text
Axios → detectar 401 → limpiar token
```

Mientras que posteriormente el `AuthContext` y el sistema de rutas serán responsables de:

```text
Sesión → usuario → navegación → acceso
```

Esto evita acoplar Axios directamente con React Router.

---

# 1.4 Función genérica `request<T>`

Se creó:

```text
src/api/request.ts
```

La función permite realizar peticiones tipadas utilizando un genérico:

```text
request<Event[]>
request<Category[]>
request<User>
```

### ¿Por qué utilizar un genérico?

La API devuelve diferentes tipos de información.

En lugar de utilizar `any`, el tipo de respuesta se determina al realizar la petición.

Por ejemplo:

```text
request<Event[]>
```

indica que la respuesta esperada es un arreglo de eventos.

Esto permite que TypeScript detecte errores y proporcione autocompletado en el resto de la aplicación.

### Relación con el requisito de la prueba

El enunciado solicita explícitamente:

> Un genérico reutilizable (`useFetch<T>` o función `request<T>`).

La implementación cumple este requisito mediante:

```text
request<T>
```

---

# 1.5 Services

Se crearon servicios independientes para cada recurso.

## Auth

```text
authService
├── login
├── register
└── logout
```

## Categories

```text
categoryService
├── getAll
├── getById
├── create
├── update
└── remove
```

## Events

```text
eventService
├── getAll
├── getById
├── create
├── update
└── remove
```

## Favorites

```text
favoriteService
├── getAll
├── add
└── remove
```

### Decisión

Los componentes no realizarán directamente llamadas HTTP.

En lugar de:

```text
Componente → Axios
```

se utiliza:

```text
Componente → Service → API
```

### Ventaja

Si posteriormente cambia un endpoint o la forma de realizar una petición, el cambio se realiza en el servicio correspondiente y no en todos los componentes que utilizan esa funcionalidad.

---

# 1.6 Tipado de usuarios

Se creó:

```text
src/types/user.ts
```

El rol se definió como:

```text
"user" | "admin"
```

en lugar de utilizar simplemente:

```text
string
```

### Decisión

Esto permite que TypeScript restrinja los posibles roles a los valores definidos por el backend.

Además, facilita posteriormente condiciones como:

```text
user.role === "admin"
```

para controlar funcionalidades administrativas.

---

# 1.7 Tipado de autenticación

Se creó:

```text
src/types/auth.ts
```

Se definieron tipos separados para:

```text
AuthResponse
LoginData
RegisterData
```

Esto distingue entre:

### Datos enviados

```text
LoginData
RegisterData
```

y:

### Datos recibidos

```text
AuthResponse
```

La separación evita mezclar estructuras de entrada y salida de la API.

---

# 1.8 Tipado de categorías

Se definieron:

```text
Category
CategoryData
```

`Category` representa la respuesta completa del backend:

```text
id
name
description
createdAt
updatedAt
```

Mientras `CategoryData` representa los datos necesarios para crear o actualizar una categoría:

```text
name
description
```

---

# 1.9 Tipado de eventos

Se definieron:

```text
Event
EventImage
EventData
```

Esto permite representar correctamente tanto el evento completo como sus imágenes.

La estructura refleja la respuesta real observada en Swagger.

---

# 1.10 Filtros de eventos

El endpoint:

```text
GET /events
```

permite:

```text
search
categoryId
```

Por esta razón, `eventService` acepta filtros opcionales.

Conceptualmente:

```text
getAll()
```

realiza:

```text
GET /events
```

mientras:

```text
getAll({
    search,
    categoryId
})
```

genera una petición equivalente a:

```text
GET /events?search=...&categoryId=...
```

### Decisión

Los filtros se envían como `query parameters`, no como body, porque así está definido el contrato HTTP del backend.

---

# 1.11 Hook `useFetch<T>`

Se creó:

```text
src/hooks/useFetch.ts
```

Este hook utiliza:

```text
useEffect
useState
```

y recibe una función que devuelve una promesa.

Su estado permite manejar:

```text
data
loading
error
```

El hook utiliza el sistema genérico de TypeScript para conocer el tipo de información que recibe.

Ejemplo conceptual:

```text
useFetch<Event[]>
```

o:

```text
useFetch<Category[]>
```

### Decisión

Centralizar el patrón de:

```text
loading → petición → resultado/error
```

evita repetir la misma lógica en diferentes páginas.

Además, el uso de `useEffect` permite cumplir el requisito específico de la prueba.

---

# 1.12 Primera integración real

Antes de continuar con la autenticación se realizó una prueba utilizando:

```text
GET /categories
```

El flujo completo fue:

```text
App
 ↓
useFetch
 ↓
categoryService
 ↓
request<Category[]>
 ↓
apiClient
 ↓
Axios
 ↓
GET /categories
 ↓
Backend
```

La API respondió correctamente con la categoría creada mediante Swagger.

Posteriormente se verificó también:

```text
GET /events
```

obteniendo el evento creado en el backend.

### Resultado

La comunicación básica entre frontend y backend quedó validada antes de construir funcionalidades dependientes de ella.

---

# Arquitectura actual

La arquitectura inicial del frontend queda organizada de la siguiente manera:

```text
                    React
                      │
                 Components
                      │
                    Hooks
                      │
                  Services
                      │
                 request<T>
                      │
                  Axios Client
                  /          \
        Request Interceptor   Response Interceptor
              │                     │
         JWT Bearer                401
              │                     │
              └─────────┬───────────┘
                        ↓
                   PlanCity API
```

Esta separación busca mantener:

* Componentes enfocados en la interfaz.
* Hooks enfocados en estado y ciclo de vida.
* Services enfocados en funcionalidades de la API.
* Axios enfocado en comunicación HTTP.
* Types enfocados en el contrato de datos.

---

# Decisiones principales hasta Fase 1

| Decisión                | Motivo                                               |
| ----------------------- | ---------------------------------------------------- |
| React + TypeScript      | Stack solicitado y tipado seguro                     |
| Vite                    | Configuración rápida y adecuada para la prueba       |
| Axios                   | Interceptores y cliente HTTP centralizado            |
| localStorage            | Persistencia del token entre recargas                |
| `request<T>`            | Genérico reutilizable y tipado                       |
| Services separados      | Separación de responsabilidades                      |
| DTOs separados          | Diferenciar datos enviados y recibidos               |
| Interceptor 401         | Detectar sesiones inválidas centralizadamente        |
| `.env`                  | Separar configuración del código                     |
| `useFetch<T>`           | Reutilizar estado de carga/error y cumplir requisito |
| Swagger como referencia | Trabajar contra el contrato real del backend         |

---

# Estado del proyecto

### Fase 0 — Preparación

* [x] Backend funcionando.
* [x] Swagger revisado.
* [x] Endpoints identificados.
* [x] Roles identificados.
* [x] Respuestas de autenticación verificadas.
* [x] Modelos de datos analizados.
* [x] Proyecto React + TypeScript + Vite creado.
* [x] Variables de entorno configuradas.
* [x] Git configurado.

### Fase 1 — API + TypeScript

* [x] Cliente Axios.
* [x] Interceptor de JWT.
* [x] Interceptor de `401`.
* [x] Función genérica `request<T>`.
* [x] Tipos de usuario.
* [x] Tipos de autenticación.
* [x] Tipos de categorías.
* [x] Tipos de eventos.
* [x] Servicios de autenticación.
* [x] Servicios de categorías.
* [x] Servicios de eventos.
* [x] Servicios de favoritos.
* [x] Hook `useFetch<T>`.
* [x] Prueba de conexión con `/categories`.
* [x] Prueba de conexión con `/events`.

---

# Próxima fase

## Fase 2 — Autenticación y sesión

La siguiente fase estará enfocada en:

* `AuthContext`.
* Login.
* Registro.
* Persistencia de sesión.
* Logout.
* Recuperación del usuario mediante `/users/me`.
* Protección de rutas.
* Diferenciación entre `user` y `admin`.
* Redirección ante acceso no autorizado.

El objetivo será establecer primero una sesión funcional y segura antes de implementar las funcionalidades que dependen del usuario autenticado.
