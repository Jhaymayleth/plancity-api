import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Descubre tu próximo evento
          </h1>

          <p className="mt-6 text-xl leading-relaxed text-indigo-100 sm:text-2xl">
            Encuentra conciertos, talleres, actividades deportivas y mucho más en tu ciudad. Planifica tus momentos especiales con PlanCity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition hover:bg-slate-50 hover:shadow-2xl"
            >
              Explorar eventos
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Ver categorías
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              ¿Por qué elegir PlanCity?
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
              Tu compañero perfecto para eventos
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🎫",
                title: "Descubrimiento fácil",
                description: "Explora miles de eventos categorizados y filtrados por tus intereses.",
              },
              {
                icon: "❤️",
                title: "Guarda favoritos",
                description: "Marca tus eventos favoritos y accede a ellos en cualquier momento.",
              },
              {
                icon: "🔔",
                title: "Información completa",
                description: "Detalles completos: ubicación, fecha, precio y descripción de cada evento.",
              },
              {
                icon: "📱",
                title: "Diseño responsivo",
                description: "Accede desde cualquier dispositivo: computadora, tablet o teléfono.",
              },
              {
                icon: "🔐",
                title: "Cuenta segura",
                description: "Autenticación segura con contraseñas encriptadas.",
              },
              {
                icon: "🎯",
                title: "Filtros inteligentes",
                description: "Encuentra exactamente lo que buscas con nuestro sistema de filtros.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-4xl">{feature.icon}</div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold sm:text-5xl">
            ¿Listo para empezar?
          </h2>

          <p className="mt-6 text-xl text-indigo-100">
            Únete a miles de usuarios que ya descubren sus eventos favoritos en PlanCity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition hover:bg-slate-50"
            >
              Crear cuenta
            </Link>

            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Ver eventos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}