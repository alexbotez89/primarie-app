import * as React from "react";
import { cn } from "@/lib/utils";

export function NativeSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
