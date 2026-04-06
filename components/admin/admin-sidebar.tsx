"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Map } from "lucide-react";
import AdminLogoutButton from "./admin-logout-button";

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden min-h-screen w-full max-w-[260px] flex-col border-r bg-white md:flex">
        <div className="border-b p-6">
          <div className="text-xl font-semibold">Admin Primărie</div>
          <div className="mt-1 text-sm text-slate-500">Panou operațional</div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            active={pathname === "/admin/dashboard"}
          />

          <NavItem
            href="/admin/cereri"
            label="Cereri"
            icon={<FileText className="h-4 w-4" />}
            active={pathname.startsWith("/admin/cereri")}
          />

          <NavItem
            href="/admin/harta"
            label="Hartă"
            icon={<Map className="h-4 w-4" />}
            active={pathname === "/admin/harta"}
          />
        </nav>

        <div className="border-t p-4">
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="sticky top-0 z-[1000] border-b bg-white/95 backdrop-blur md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-3 py-3">
          <Link
            href="/admin/dashboard"
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              pathname === "/admin/dashboard"
                ? "bg-slate-900 text-white"
                : "border bg-white text-slate-700"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/cereri"
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              pathname.startsWith("/admin/cereri")
                ? "bg-slate-900 text-white"
                : "border bg-white text-slate-700"
            }`}
          >
            Cereri
          </Link>

          <Link
            href="/admin/harta"
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              pathname === "/admin/harta"
                ? "bg-slate-900 text-white"
                : "border bg-white text-slate-700"
            }`}
          >
            Hartă
          </Link>

          <div className="ml-auto">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}