type Priority = "Scăzută" | "Medie" | "Ridicată" | "Critică";

const priorityStyles: Record<Priority, string> = {
  "Scăzută": "bg-slate-100 text-slate-700 border-slate-200",
  "Medie": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Ridicată": "bg-orange-100 text-orange-800 border-orange-200",
  "Critică": "bg-red-100 text-red-800 border-red-200",
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const cls =
    priorityStyles[priority as Priority] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
    >
      {priority}
    </span>
  );
}