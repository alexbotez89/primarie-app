type Status =
  | "Nouă"
  | "În verificare"
  | "Alocată"
  | "În lucru"
  | "Rezolvată"
  | "Respinsă"
  | "Escaladată";

const statusStyles: Record<Status, string> = {
  "Nouă": "bg-slate-100 text-slate-800 border-slate-200",
  "În verificare": "bg-amber-100 text-amber-800 border-amber-200",
  "Alocată": "bg-sky-100 text-sky-800 border-sky-200",
  "În lucru": "bg-blue-100 text-blue-800 border-blue-200",
  "Rezolvată": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Respinsă": "bg-rose-100 text-rose-800 border-rose-200",
  "Escaladată": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls =
    statusStyles[status as Status] ||
    "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}