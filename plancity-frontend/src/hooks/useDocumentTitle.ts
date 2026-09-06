import { useEffect } from "react";

/** Título por ruta para SEO y lectores de pantalla. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · PlanCity`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
