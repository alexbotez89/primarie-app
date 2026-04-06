import { requireAdmin } from "@/lib/auth/require-admin";
import MapClient from "./map-client";

export default async function AdminMapPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-semibold">Hartă operațională</h1>
      <MapClient />
    </main>
  );
}