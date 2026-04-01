import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCereriPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("requests")
    .select("id, code, title, status, priority, category, district, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Cereri cetățenești</h1>

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
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.code}</td>
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
          </tbody>
        </table>
      </div>
    </main>
  );
}