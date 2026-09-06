import type { ReactNode } from "react";
import { CalendarX2 } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {icon ?? <CalendarX2 className="h-7 w-7" aria-hidden="true" />}
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-slate-500">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
