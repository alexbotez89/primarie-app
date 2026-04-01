import { requireAdmin } from "@/lib/auth/require-admin";
import DashboardClient from "./dashboard-client";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Dashboard operațional</h1>
      <DashboardClient />
    </main>
  );
}