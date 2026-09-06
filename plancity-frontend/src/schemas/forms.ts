import { z } from "zod";

/**
 * Schemas de validación cliente.
 * Espejan 1:1 las reglas de los DTOs del backend (class-validator),
 * para fallar en el formulario antes de recibir 400/409 del servidor.
 * No agregan reglas que la API no tenga.
 */

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// --- Auth: espejo de LoginDto (email, password min 6) ---
export const loginSchema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Ingresa un correo válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// --- Auth: espejo de RegisterDto (name min 2, email, password min 6) ---
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().min(1, "Ingresa tu correo").email("Ingresa un correo válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// --- Categorías: espejo de CreateCategoryDto (name 2-100, description max 255 opcional) ---
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(255, "La descripción no puede superar 255 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// --- Eventos: espejo de CreateEventDto ---
const imageUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isHttpUrl(value), {
    message: "Ingresa una URL válida (https://...)",
  });

export const eventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().trim().optional().or(z.literal("")),
  date: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ingresa una fecha válida",
    }),
  location: z
    .string()
    .trim()
    .min(2, "La ubicación debe tener al menos 2 caracteres"),
  price: z
    .number({ error: "Ingresa un precio válido" })
    .min(0, "El precio no puede ser negativo")
    .refine((value) => Number.isInteger(value * 100), {
      message: "El precio admite máximo 2 decimales",
    }),
  capacity: z
    .number({ error: "Ingresa una capacidad válida" })
    .int("La capacidad debe ser un número entero")
    .positive("La capacidad debe ser mayor a 0"),
  categoryId: z.string().uuid("Selecciona una categoría"),
  // Sin .default(): useForm ya provee defaultValues; así input y output coinciden.
  images: z
    .array(z.object({ url: imageUrlSchema }))
    .max(10, "Máximo 10 imágenes"),
});

export type EventFormData = z.infer<typeof eventSchema>;
