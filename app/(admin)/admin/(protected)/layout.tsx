import { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}