import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { sendStatusUpdatedEmail } from "@/lib/utils/email";

const updateRequestSchema = z.object({
  status: z
    .enum([
      "Nouă",
      "În verificare",
      "Alocată",
      "În lucru",
      "Rezolvată",
      "Respinsă",
      "Escaladată",
    ])
    .optional(),
  priority: z
    .enum(["Scăzută", "Medie", "Ridicată", "Critică"])
    .optional(),
  estimated_resolution_date: z.string().nullable().optional(),
});

async function getCurrentProfileId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  return profile?.id ?? null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const profileId = await getCurrentProfileId();

    if (!profileId) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    const admin = createAdminClient();

    const { data: existing, error: existingError } = await admin
      .from("requests")
      .select("id, code, title, status, priority, estimated_resolution_date, citizen_name, citizen_email")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "Cererea nu a fost găsită." },
        { status: 404 }
      );
    }

    const updatePayload: {
      status?: string;
      priority?: string;
      estimated_resolution_date?: string | null;
      resolved_at?: string | null;
    } = {};

    if (parsed.data.status !== undefined) {
      updatePayload.status = parsed.data.status;
      updatePayload.resolved_at =
        parsed.data.status === "Rezolvată" ? new Date().toISOString() : null;
    }

    if (parsed.data.priority !== undefined) {
      updatePayload.priority = parsed.data.priority;
    }

    if (parsed.data.estimated_resolution_date !== undefined) {
      updatePayload.estimated_resolution_date =
        parsed.data.estimated_resolution_date;
    }

    const { data: updated, error: updateError } = await admin
      .from("requests")
      .update(updatePayload)
      .eq("id", id)
      .select(
        "id, code, title, status, priority, category, district, estimated_resolution_date, created_at"
      )
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { error: "Nu am putut actualiza cererea." },
        { status: 500 }
      );
    }

    const updatesToInsert: Array<{
      request_id: string;
      type:
        | "status_changed"
        | "priority_changed"
        | "comment_public"
        | "comment_internal"
        | "assignment_changed"
        | "created";
      message: string;
      is_public: boolean;
      created_by: string | null;
    }> = [];

    if (
      parsed.data.status !== undefined &&
      parsed.data.status !== existing.status
    ) {
      updatesToInsert.push({
        request_id: id,
        type: "status_changed",
        message: `Statusul cererii a fost schimbat în „${parsed.data.status}”.`,
        is_public: true,
        created_by: profileId,
      });
    }

    if (
      parsed.data.priority !== undefined &&
      parsed.data.priority !== existing.priority
    ) {
      updatesToInsert.push({
        request_id: id,
        type: "priority_changed",
        message: `Prioritatea cererii a fost schimbată în „${parsed.data.priority}”.`,
        is_public: false,
        created_by: profileId,
      });
    }

    if (updatesToInsert.length > 0) {
      await admin.from("request_updates").insert(updatesToInsert);
    }
if (
  parsed.data.status !== undefined &&
  parsed.data.status !== existing.status
) {
  try {
    await sendStatusUpdatedEmail({
      to: existing.citizen_email,
      citizenName: existing.citizen_name,
      code: existing.code,
      title: existing.title,
      status: parsed.data.status,
    });
  } catch (emailError) {
    console.error("STATUS UPDATED EMAIL ERROR:", emailError);
  }
}
    return NextResponse.json({ success: true, request: updated });
  } catch {
    return NextResponse.json(
      { error: "Actualizarea nu a putut fi procesată." },
      { status: 500 }
    );
  }
}