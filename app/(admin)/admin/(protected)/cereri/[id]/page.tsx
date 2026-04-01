import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import RequestDetailForm from "./request-detail-form";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from("requests")
    .select(
      `
      id,
      code,
      citizen_name,
      citizen_email,
      citizen_phone,
      title,
      description,
      category,
      status,
      priority,
      district,
      address,
      estimated_resolution_date,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .single();

  const { data: updates } = await admin
    .from("request_updates")
    .select("id, type, message, is_public, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  if (!request) {
    return <main className="mx-auto max-w-4xl p-6">Cererea nu a fost găsită.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Detaliu cerere</h1>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 rounded-2xl border bg-white p-6">
          <div>
            <div className="text-sm text-slate-500">Cod cerere</div>
            <div className="text-lg font-semibold">{request.code}</div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Titlu</div>
            <div className="font-medium">{request.title}</div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Descriere</div>
            <div>{request.description}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-slate-500">Categorie</div>
              <div>{request.category}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Zonă</div>
              <div>{request.district}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Adresă</div>
              <div>{request.address || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Creată la</div>
              <div>{new Date(request.created_at).toLocaleString("ro-RO")}</div>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="mb-2 font-medium">Date cetățean</div>
            <div className="space-y-1 text-sm text-slate-700">
              <div><strong>Nume:</strong> {request.citizen_name}</div>
              <div><strong>Email:</strong> {request.citizen_email}</div>
              <div><strong>Telefon:</strong> {request.citizen_phone || "—"}</div>
            </div>
          </div>
        </section>

        <RequestDetailForm request={request} updates={updates ?? []} />
      </div>
    </main>
  );
}