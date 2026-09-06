import { cn } from "../../utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pc-skeleton rounded-xl", className ?? "h-4 w-full")}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <div
      aria-label="Cargando evento"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
