import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-label="Cargando"
      role="status"
      className={cn("h-5 w-5 animate-spin text-indigo-600", className)}
    />
  );
}
