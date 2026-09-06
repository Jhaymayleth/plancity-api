# PlanCity — Frontend

## Documento de decisiones técnicas y de desarrollo

> **Proyecto:** PlanCity
> **Tipo:** Aplicación web para descubrimiento y gestión de eventos
> **Frontend:** React + TypeScript + Vite
> **Estilos:** Tailwind CSS
> **Gestión de estado:** React / Zustand
> **Consumo de API:** Axios
> **Testing:** Vitest + React Testing Library
> **Enrutamiento:** React Router DOM
> **Gestión de datos:** TanStack Query
> **Validación:** Zod
> **Formulario:** React Hook Form

---

# 1. Introducción

PlanCity es una aplicación web orientada al descubrimiento de eventos y actividades, permitiendo a los usuarios consultar eventos, visualizar información detallada, navegar entre diferentes secciones y guardar eventos como favoritos.

El desarrollo del frontend se realizó utilizando una arquitectura basada en componentes y tecnologías modernas del ecosistema React.

El objetivo principal de las decisiones técnicas fue construir una aplicación:

* Escalable.
* Mantenible.
* Tipada.
* Modular.
* Reutilizable.
* Fácil de probar.
* Preparada para integrarse con un backend.
* Coherente visualmente.
* Adecuada para continuar agregando funcionalidades.

Este documento registra las principales decisiones tomadas durante el desarrollo y explica las razones técnicas detrás de ellas.

---

# 2. Objetivo del documento

Este documento tiene como finalidad explicar el proceso de toma de decisiones utilizado durante el desarrollo del frontend.

No solamente se documenta **qué tecnología fue utilizada**, sino también:

* Por qué fue seleccionada.
* Qué problema resuelve.
* Qué alternativas existían.
* Por qué se descartaron determinadas alternativas.
* Cómo afecta la decisión a la arquitectura.
* Qué beneficios proporciona al proyecto.
* Qué consideraciones deben tenerse en cuenta para futuras etapas.

Esto permite demostrar que las decisiones del proyecto no fueron arbitrarias, sino resultado de criterios técnicos y funcionales.

---

# 3. Principios utilizados para tomar decisiones

Durante el desarrollo se utilizaron los siguientes criterios.

## 3.1 Mantenibilidad

Se priorizaron soluciones que permitan modificar y ampliar el proyecto sin tener que realizar cambios importantes en múltiples partes de la aplicación.

---

## 3.2 Reutilización

Cuando una funcionalidad o elemento visual podía utilizarse en diferentes páginas, se optó por convertirlo en un componente reutilizable.

Por ejemplo:

```text
EventCard
```

puede utilizarse para mostrar eventos en diferentes secciones.

---

## 3.3 Tipado seguro

Se decidió utilizar TypeScript para reducir errores relacionados con tipos de datos y mejorar la experiencia de desarrollo.

---

## 3.4 Separación de responsabilidades

Se evitó concentrar toda la lógica dentro de las páginas.

La aplicación separa responsabilidades entre:

```text
Pages
Components
Services
API
Hooks
Types
Routes
```

---

## 3.5 Testabilidad

Las funcionalidades importantes deben poder comprobarse mediante pruebas automatizadas.

Por esta razón se incorporó una estrategia de testing desde el desarrollo de los componentes.

---

## 3.6 Escalabilidad

Las decisiones actuales buscan que el proyecto pueda crecer sin necesidad de reconstruir completamente la arquitectura.

---

# 4. Elección de React

## Decisión

Se seleccionó **React** como biblioteca principal para construir la interfaz.

## Motivo

React permite construir interfaces utilizando componentes independientes y reutilizables.

Esto resulta adecuado para PlanCity porque existen elementos que se repiten en diferentes partes de la aplicación.

Ejemplos:

* Navbar.
* EventCard.
* Botones.
* Formularios.
* Estados de carga.
* Mensajes de error.
* Elementos de navegación.

## Beneficio

La interfaz puede dividirse en piezas pequeñas y reutilizables.

En lugar de construir una página monolítica:

```text
HomePage
```

se puede estructurar como:

```text
HomePage
 ├── Navbar
 ├── Hero
 ├── EventSection
 │    └── EventCard
 └── Footer
```

Esto facilita el mantenimiento.

---

# 5. Elección de TypeScript

## Decisión

Se decidió utilizar TypeScript en lugar de JavaScript puro.

## Motivo

La aplicación trabaja con entidades estructuradas como:

```text
Event
User
Favorite
API Response
```

TypeScript permite definir contratos para estas estructuras.

Por ejemplo:

```ts
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
}
```

De esta manera, si un componente recibe un evento incorrectamente estructurado, el error puede detectarse durante el desarrollo.

## Beneficios

* Mayor seguridad de tipos.
* Autocompletado.
* Detección temprana de errores.
* Mejor mantenimiento.
* Refactorización más segura.
* Mejor documentación implícita del código.

## Alternativa descartada

### JavaScript

Aunque JavaScript habría permitido desarrollar más rápidamente algunas funcionalidades iniciales, no ofrecía el mismo nivel de seguridad de tipos.

Debido a que el proyecto está pensado para crecer, se priorizó TypeScript.

---

# 6. Elección de Vite

## Decisión

Se utilizó Vite como herramienta de construcción y entorno de desarrollo.

## Motivo

Vite proporciona:

* Inicio rápido del servidor.
* Hot Module Replacement.
* Configuración sencilla.
* Integración con React y TypeScript.
* Build optimizado.

Esto permite reducir tiempos durante el desarrollo.

## Alternativa

Una alternativa habría sido Create React App.

Sin embargo, se decidió utilizar Vite debido a su rendimiento y a que actualmente ofrece una experiencia de desarrollo más moderna.

---

# 7. Tailwind CSS

## Decisión

Se utilizó Tailwind CSS para la construcción de estilos.

## Motivo

La aplicación requiere desarrollar rápidamente una interfaz consistente y responsive.

Tailwind permite aplicar estilos directamente mediante clases utilitarias.

Ejemplo:

```tsx
<div className="rounded-2xl bg-white p-6 shadow-sm">
```

Esto permite mantener los estilos cerca de la estructura del componente.

## Beneficios

* Desarrollo rápido.
* Responsive design.
* Consistencia.
* Menor necesidad de CSS repetitivo.
* Fácil modificación de componentes.
* Sistema de utilidades predecible.

---

# 8. Decisión sobre la identidad visual

## Decisión

Se decidió evitar una interfaz excesivamente oscura y utilizar una estética moderna con fondos claros y acentos de color.

## Motivo

PlanCity es una plataforma orientada a descubrir eventos.

La interfaz debía transmitir:

* Actividad.
* Descubrimiento.
* Modernidad.
* Facilidad de navegación.

Por esta razón se evitó utilizar una interfaz completamente oscura como la primera propuesta del homepage.

## Criterio

El color principal debe funcionar como elemento de identidad visual y no como decoración aislada.

Por esta razón se buscó mantener la misma identidad visual entre:

* Home.
* Eventos.
* Favoritos.
* Detalle.
* Navegación.
* Botones.
* Estados interactivos.

---

# 9. Componentización

## Decisión

Se decidió dividir la interfaz en componentes reutilizables.

Ejemplo:

```text
src/
├── components/
│   ├── EventCard/
│   ├── Navbar/
│   └── ...
├── pages/
├── services/
├── hooks/
├── types/
├── api/
└── routes/
```

## Motivo

Una página no debería contener toda la lógica visual de la aplicación.

Por ejemplo, `EventCard` encapsula la presentación de un evento.

Esto permite reutilizarlo en:

* Página de eventos.
* Favoritos.
* Recomendaciones.
* Homepage.
* Resultados de búsqueda.

---

# 10. EventCard

## Decisión

Se creó un componente específico para representar eventos.

## Responsabilidades

El componente se encarga de:

* Mostrar imagen.
* Mostrar título.
* Mostrar categoría.
* Mostrar descripción.
* Mostrar ubicación.
* Mostrar precio.
* Permitir gestionar favoritos.
* Proporcionar acceso al detalle.

## Beneficio

La representación visual de un evento queda centralizada.

Si posteriormente se cambia el diseño de una tarjeta, el cambio puede realizarse en un solo componente.

---

# 11. React Router DOM

## Decisión

Se utilizó React Router DOM para administrar la navegación.

## Motivo

PlanCity es una SPA y requiere múltiples vistas sin recargar completamente la página.

Ejemplos:

```text
/
 /events
 /events/:id
 /favorites
 /login
```

## Beneficios

* Navegación SPA.
* Rutas dinámicas.
* Rutas protegidas.
* Redirecciones.
* Integración con componentes React.

---

# 12. Prevención de múltiples Routers

Durante el desarrollo apareció un problema:

```text
You cannot render a <Router> inside another <Router>
```

## Causa

Existían dos instancias de Router en la aplicación.

## Decisión

Se centralizó el Router en la configuración principal de rutas.

La aplicación debe tener una única instancia del Router.

## Motivo

React Router no permite anidar routers de forma convencional dentro de la aplicación.

Esta corrección evita conflictos de contexto y navegación.

---

# 13. Arquitectura de API

Se decidió separar las llamadas HTTP de los componentes visuales.

La estructura utilizada es:

```text
src/
├── api/
│   ├── client.ts
│   ├── error.ts
│   └── index.ts
│
├── services/
│   └── ...
```

## Motivo

Un componente no debería conocer detalles como:

```text
URL
HTTP method
headers
interceptors
error handling
```

Estos aspectos deben gestionarse en una capa de servicios.

---

# 14. Axios

## Decisión

Se utilizó Axios para las comunicaciones HTTP.

## Motivo

Axios facilita:

* Configuración de una instancia.
* Interceptors.
* Headers.
* Manejo de errores.
* Variables de entorno.
* Organización de llamadas API.

Esto permite tener un cliente centralizado.

---

# 15. Variables de entorno

## Decisión

Las URLs y configuraciones externas no deben escribirse directamente dentro de los componentes.

Se utilizan variables de entorno.

Ejemplo conceptual:

```env
VITE_API_URL=...
```

## Motivo

Esto permite cambiar el backend sin modificar el código fuente.

Por ejemplo:

```text
Desarrollo → API de desarrollo
Pruebas → API de pruebas
Producción → API de producción
```

---

# 16. Servicios

Se decidió implementar servicios específicos para cada dominio.

Ejemplo:

```text
favoriteService
moviesApi
```

Estos servicios centralizan las operaciones relacionadas con una entidad.

## Beneficio

La lógica de acceso a datos no queda distribuida por toda la aplicación.

---

# 17. TanStack Query

## Decisión

Se utilizó TanStack Query para gestionar datos provenientes de la API.

## Motivo

Una aplicación que consume APIs debe controlar:

* Loading.
* Success.
* Error.
* Cache.
* Refetch.
* Actualización de datos.

TanStack Query proporciona estas capacidades.

## Beneficio

Se evita implementar manualmente toda la lógica de:

```text
useEffect
useState
loading
error
cache
refetch
```

para cada consulta.

---

# 18. Zustand

## Decisión

Se utilizó Zustand para manejar estado global cuando sea necesario.

## Motivo

No todo el estado debe convertirse en estado global.

Se utiliza estado local cuando la información pertenece exclusivamente a un componente.

Se utiliza estado global cuando múltiples partes de la aplicación necesitan acceder a la misma información.

## Criterio

```text
Estado local
↓
useState / hooks

Estado remoto
↓
TanStack Query

Estado global de aplicación
↓
Zustand
```

Esta separación evita utilizar una única herramienta para todos los tipos de estado.

---

# 19. React Hook Form

## Decisión

Se utilizó React Hook Form para manejar formularios.

## Motivo

Permite:

* Registrar campos.
* Validar formularios.
* Controlar errores.
* Reducir renders innecesarios.
* Simplificar formularios complejos.

---

# 20. Zod

## Decisión

Se utilizó Zod para validación estructurada.

## Motivo

Permite definir reglas de validación y mantener coherencia entre los datos esperados y los datos recibidos.

Ejemplo conceptual:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

# 21. Favoritos

## Decisión

Se implementó una funcionalidad específica para gestionar favoritos.

La página utiliza:

```text
favoriteService
```

para obtener los eventos guardados.

## Flujo

```text
Usuario
   ↓
EventCard
   ↓
Favorite action
   ↓
favoriteService
   ↓
API
```

La página de favoritos posteriormente consulta la información mediante el servicio.

---

# 22. Manejo de estados

Se decidió contemplar diferentes estados de la aplicación.

## Loading

Mientras se cargan datos:

```text
Cargando favoritos...
```

## Error

Cuando ocurre un problema:

```text
No se pudieron cargar tus favoritos.
```

## Empty state

Cuando el usuario no tiene favoritos:

```text
Aún no tienes favoritos
```

## Success

Cuando existen datos:

```text
Listado de eventos
```

## Motivo

Una aplicación real no debe diseñarse solamente para el caso ideal donde todo funciona correctamente.

---

# 23. Página de favoritos

La página `FavoritesPage` fue diseñada para contemplar tres estados principales:

```text
Loading
Error
Success
```

Y dentro del estado exitoso:

```text
Con favoritos
Sin favoritos
```

Esto permite una mejor experiencia de usuario.

---

# 24. Actualización de favoritos

Cuando un usuario elimina un favorito desde la página de favoritos, el evento debe desaparecer inmediatamente del listado.

La lógica utilizada es equivalente a:

```ts
setFavorites((currentFavorites) =>
  currentFavorites.filter(
    (event) => event.id !== eventId,
  ),
);
```

## Motivo

Se actualiza el estado local inmediatamente después de la acción.

Esto evita que el usuario tenga que recargar manualmente la página.

---

# 25. Testing

## Decisión

Se implementaron pruebas utilizando:

```text
Vitest
React Testing Library
```

## Motivo

Las pruebas permiten verificar que los componentes se comportan como espera el usuario.

Se prioriza probar comportamiento en lugar de detalles internos de implementación.

---

# 26. EventCard Testing

Entre los comportamientos evaluados se encuentran:

* Renderización del evento.
* Título.
* Categoría.
* Descripción.
* Ubicación.
* Precio.
* Imagen.
* Enlace al detalle.
* Estado de favorito.
* Acción de agregar favorito.
* Acción de quitar favorito.

---

# 27. Problema detectado durante testing

Durante la ejecución de las pruebas se detectaron diferencias entre algunos tests y la implementación actual.

Por ejemplo, un test esperaba:

```text
Ver detalles
```

mientras que el componente actualmente muestra:

```text
Ver detalles →
```

También existía una diferencia entre el texto esperado del botón de favoritos y la implementación visual actual.

## Decisión

No se debe modificar la interfaz únicamente para satisfacer un test desactualizado.

Primero se debe determinar cuál es el comportamiento correcto según los requerimientos.

Si el diseño actual es correcto, el test debe actualizarse para comprobar el comportamiento real.

Por ejemplo:

```tsx
screen.getByRole("link", {
  name: /Ver detalles/i,
});
```

Esto resulta más robusto que depender de coincidencias exactas de texto.

---

# 28. Testing basado en accesibilidad

Cuando sea posible, se decidió utilizar queries como:

```tsx
getByRole()
```

en lugar de depender únicamente de:

```tsx
getByText()
```

## Motivo

Las consultas basadas en roles representan mejor cómo un usuario interactúa con la interfaz y permiten crear pruebas menos frágiles.

Ejemplo:

```tsx
screen.getByRole("button", {
  name: /favoritos/i,
});
```

---

# 29. ESLint

## Decisión

Se configuró ESLint.

## Motivo

Permite detectar:

* Errores potenciales.
* Imports innecesarios.
* Problemas de React.
* Variables sin utilizar.
* Patrones problemáticos.

El linting ayuda a mantener una base de código consistente.

---

# 30. Prettier

## Decisión

Se utilizó Prettier para mantener un formato consistente.

## Motivo

El formato del código no debería depender de las preferencias individuales de cada desarrollador.

Esto facilita el trabajo colaborativo.

---

# 31. Git y control de versiones

Se utiliza Git para gestionar el historial del proyecto.

Se siguió una estrategia basada en ramas.

Ejemplo:

```text
main
develop
feature/HU-...
```

## Motivo

La rama principal debe representar una versión estable.

El desarrollo de funcionalidades se realiza mediante ramas independientes.

---

# 32. Feature branches

Las funcionalidades se desarrollan en ramas independientes.

Ejemplo:

```text
feature/HU-CINE-004-...
```

## Beneficio

Permite:

* Aislar cambios.
* Revisar código.
* Reducir conflictos.
* Asociar cambios con historias de usuario.
* Facilitar integración.

---

# 33. Organización por responsabilidades

La estructura general sigue una separación aproximada:

```text
src/
│
├── api/
│
├── components/
│
├── hooks/
│
├── pages/
│
├── routes/
│
├── services/
│
├── types/
│
├── App.tsx
│
└── main.tsx
```

## Justificación

Cada directorio tiene una responsabilidad específica.

Esto facilita localizar código y reducir dependencias innecesarias.

---

# 34. Decisión de no utilizar Sass

Durante el desarrollo se evaluó el uso de Sass.

Sin embargo, se presentó un problema relacionado con la dependencia:

```text
sass-embedded
```

## Decisión

Se decidió continuar utilizando Tailwind CSS y CSS estándar en lugar de incorporar Sass.

## Motivo

El proyecto no necesitaba obligatoriamente las capacidades adicionales de Sass y mantener menos dependencias reduce posibles problemas de configuración.

---

# 35. Responsive Design

## Decisión

La interfaz debe adaptarse a diferentes tamaños de pantalla.

Se utilizan breakpoints de Tailwind.

Ejemplo:

```text
sm
md
lg
xl
```

## Motivo

Los usuarios pueden acceder desde:

* Computadores.
* Tablets.
* Teléfonos.

Por lo tanto, el diseño no debe depender de una única resolución.

---

# 36. Accesibilidad básica

Se consideraron elementos como:

* `aria-label`.
* Roles semánticos.
* Texto alternativo para imágenes.
* Botones reales para acciones.
* Links reales para navegación.

Ejemplo:

```tsx
<button
  aria-label="Agregar evento a favoritos"
>
```

Esto mejora la interacción con tecnologías de asistencia.

---

# 37. Seguridad

Se tomó la decisión de no almacenar información sensible directamente en el frontend.

La aplicación debe evitar:

* Contraseñas almacenadas manualmente.
* Información bancaria.
* Datos sensibles innecesarios.
* Secretos del backend.

Las claves privadas del backend nunca deben exponerse mediante variables `VITE_*`.

---

# 38. Separación frontend/backend

Se decidió mantener una separación clara entre frontend y backend.

```text
Frontend
   ↓
API
   ↓
Backend
   ↓
Database
```

El frontend no debe acceder directamente a la base de datos.

Esto permite que el backend controle:

* Autenticación.
* Autorización.
* Validaciones.
* Acceso a datos.
* Seguridad.

---

# 39. Mock API / desarrollo independiente

Mientras el backend no estuviera completamente disponible, se contempló el uso de APIs mock para permitir que el frontend continuara desarrollándose.

## Motivo

El frontend y backend pueden avanzar paralelamente.

Esto evita que el equipo frontend quede completamente bloqueado esperando la implementación del backend.

---

# 40. Manejo de errores

Se decidió que los errores de API deben tratarse de manera controlada.

La interfaz no debe mostrar errores técnicos innecesarios al usuario.

En lugar de:

```text
AxiosError: Request failed with status code 500
```

se debe mostrar un mensaje comprensible.

Ejemplo:

```text
No se pudieron cargar tus favoritos.
```

---

# 41. Principio de no duplicación

Cuando existe lógica repetida, se debe evaluar si puede extraerse a:

* Hook.
* Servicio.
* Componente.
* Utilidad.

Esto evita tener varias implementaciones diferentes de la misma funcionalidad.

---

# 42. Decisiones sobre el Homepage

El homepage fue revisado para mantener coherencia con el resto de la aplicación.

La primera versión utilizaba una estética completamente oscura:

```text
bg-zinc-950
text-white
pink-500
```

Sin embargo, se consideró que esta implementación no era consistente con las demás páginas.

## Decisión

El homepage debe compartir:

* Paleta.
* Tipografía.
* Espaciado.
* Componentes.
* Botones.
* Estados visuales.

con el resto de PlanCity.

## Motivo

Una aplicación debe sentirse como un único producto y no como un conjunto de páginas independientes.

---

# 43. Criterio para modificar tests

Cuando una prueba automatizada falla, no se debe modificar inmediatamente el código de producción.

Primero se determina:

```text
¿El requerimiento cambió?
        ↓
¿El componente está incorrecto?
        ↓
¿El test está desactualizado?
        ↓
¿Existe un problema real?
```

Solamente después de identificar la causa se decide qué archivo modificar.

Este criterio evita introducir cambios artificiales únicamente para conseguir que los tests pasen.

---

# 44. Validación final

Antes de considerar una funcionalidad terminada se deben comprobar:

### Código

```bash
npm run lint
```

### TypeScript

```bash
npx tsc --noEmit
```

### Tests

```bash
npm test
```

### Build

```bash
npm run build
```

Los comandos exactos deben corresponder a los scripts definidos en `package.json`.

---

# 45. Definition of Done

Una funcionalidad se considera terminada cuando:

* [ ] El requerimiento está implementado.
* [ ] La interfaz funciona correctamente.
* [ ] La navegación funciona.
* [ ] Los estados loading/error/empty fueron contemplados.
* [ ] La integración con servicios funciona.
* [ ] No existen errores TypeScript.
* [ ] El lint no presenta errores bloqueantes.
* [ ] Los tests relacionados pasan.
* [ ] El build funciona.
* [ ] El código está correctamente organizado.
* [ ] La funcionalidad es responsive.
* [ ] La experiencia visual es consistente.
* [ ] El cambio está correctamente versionado.

---

# 46. Resultado de la toma de decisiones

Las decisiones tomadas durante el desarrollo buscan equilibrar:

```text
Funcionalidad
      +
Mantenibilidad
      +
Escalabilidad
      +
Seguridad
      +
Experiencia de usuario
      +
Testabilidad
```

La arquitectura no fue diseñada únicamente para cumplir el estado actual de la prueba, sino para permitir que PlanCity continúe creciendo.

---

# 47. Conclusión

El desarrollo de PlanCity se realizó siguiendo una estrategia basada en separación de responsabilidades, reutilización de componentes, tipado estático, pruebas automatizadas y una arquitectura preparada para integrarse con servicios externos.

Las principales decisiones, como utilizar React con TypeScript, Vite, Tailwind CSS, React Router, Axios, TanStack Query, Zustand, React Hook Form y Zod, fueron tomadas considerando las necesidades concretas de la aplicación.

Asimismo, se priorizó que las funcionalidades no solamente estuvieran implementadas visualmente, sino que pudieran ser verificadas mediante pruebas y herramientas de calidad.

El proyecto queda preparado para continuar evolucionando hacia una aplicación completa, permitiendo incorporar nuevas funcionalidades sin comprometer la estructura existente.

---

# 48. Resumen tecnológico

| Área            | Tecnología            | Motivo                       |
| --------------- | --------------------- | ---------------------------- |
| UI              | React                 | Componentización             |
| Lenguaje        | TypeScript            | Seguridad de tipos           |
| Build           | Vite                  | Desarrollo rápido            |
| Estilos         | Tailwind CSS          | Consistencia y rapidez       |
| Routing         | React Router          | SPA y navegación             |
| HTTP            | Axios                 | Cliente API centralizado     |
| Server State    | TanStack Query        | Cache y consultas            |
| Global State    | Zustand               | Estado compartido            |
| Forms           | React Hook Form       | Gestión de formularios       |
| Validation      | Zod                   | Validación tipada            |
| Testing         | Vitest                | Ejecución de tests           |
| UI Testing      | React Testing Library | Testing orientado al usuario |
| Lint            | ESLint                | Calidad del código           |
| Formatting      | Prettier              | Consistencia                 |
| Version Control | Git                   | Control de cambios           |

---

# 49. Estado del proyecto

El proyecto debe considerarse **en desarrollo** mientras existan requerimientos de la prueba pendientes de implementar o validar.

El estado final debe determinarse después de ejecutar:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

y comprobar individualmente los criterios de aceptación de cada requerimiento.

> **Importante:** que la aplicación compile correctamente no significa automáticamente que todos los requerimientos estén cumplidos. La validación final debe combinar revisión funcional, pruebas automatizadas y comprobación de criterios de aceptación.
