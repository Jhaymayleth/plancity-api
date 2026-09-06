import { cn } from "../../utils/cn";

const inputClassName =
  "w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export function fieldInputClassName(hasError: boolean): string {
  return cn(
    inputClassName,
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200",
  );
}
