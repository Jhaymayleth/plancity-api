/** Formato moneda COP sin decimales innecesarios. API envía price como número (0 = gratis). */
export function formatPriceCOP(value: number): string {
  if (value === 0) return "Gratis";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Fecha del evento (API devuelve ISO string). Ej: "15 nov 2026, 7:00 p. m." */
export function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export type EventStatus = "finalizado" | "hoy" | "proximo";

export function getEventStatus(iso: string, now = new Date()): EventStatus {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "proximo";
  if (date.getTime() < now.getTime()) return "finalizado";
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  return sameDay ? "hoy" : "proximo";
}

export function isFreeEvent(price: number): boolean {
  return price === 0;
}
