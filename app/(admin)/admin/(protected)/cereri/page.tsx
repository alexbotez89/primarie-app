import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCereriPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    priority?: string;
    q?: string;
  }>;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const params = await searchParams;

  const status = params?.status ?? "";
  const priority = params?.priority ?? "";
  const q = params?.q ?? "";

  let query = supabase
    .from("requests")
    .select("id, code, title, status, priority, category, district, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  }

  if (priority) {
    query = query.eq("priority", priority);
  }

  if (q) {
    query = query.or(`code.ilike.%${q}%,title.ilike.%${q}%`);
  }

  const { data: requests } = await query;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Cereri cetățenești</h1>

      <form className="mb-6 grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Caută după cod sau titlu"
          className="rounded-xl border p-3"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border p-3"
        >
          <option value="">Toate statusurile</option>
          <option value="Nouă">Nouă</option>
          <option value="În verificare">În verificare</option>
          <option value="Alocată">Alocată</option>
          <option value="În lucru">În lucru</option>
          <option value="Rezolvată">Rezolvată</option>
          <option value="Respinsă">Respinsă</option>
          <option value="Escaladată">Escaladată</option>
        </select>

        <select
          name="priority"
          defaultValue={priority}
          className="rounded-xl border p-3"
        >
          <option value="">Toate prioritățile</option>
          <option value="Scăzută">Scăzută</option>
          <option value="Medie">Medie</option>
          <option value="Ridicată">Ridicată</option>
          <option value="Critică">Critică</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-white"
        >
          Filtrează
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-4">Cod</th>
              <th className="p-4">Titlu</th>
              <th className="p-4">Status</th>
              <th className="p-4">Prioritate</th>
              <th className="p-4">Categorie</th>
              <th className="p-4">Zonă</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="p-4">
                  <Link href={`/admin/cereri/${item.id}`} className="font-medium underline">
                    {item.code}
                  </Link>
                </td>
                <td className="p-4">{item.title}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4">{item.priority}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">{item.district}</td>
                <td className="p-4">
                  {new Date(item.created_at).toLocaleDateString("ro-RO")}
                </td>
              </tr>
            ))}

            {!requests?.length ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  Nu există cereri pentru filtrele selectate.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}