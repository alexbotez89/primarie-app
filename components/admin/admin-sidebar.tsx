import Link from "next/link";
import { LayoutDashboard, FileText, Map } from "lucide-react";
import AdminLogoutButton from "./admin-logout-button";

export default function AdminSidebar() {
  return (
    <aside className="flex min-h-screen w-full max-w-[260px] flex-col border-r bg-white">
      <div className="border-b p-6">
        <div className="text-xl font-semibold">Admin Primărie</div>
        <div className="mt-1 text-sm text-slate-500">
          Panou operațional
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/admin/cereri"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <FileText className="h-4 w-4" />
          Cereri
        </Link>
        <Link
  href="/admin/harta"
  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
>
  <Map className="h-4 w-4" />
  Hartă
</Link>
      </nav>

      <div className="border-t p-4">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}