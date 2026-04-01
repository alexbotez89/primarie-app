import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createUpdateSchema = z.object({
  message: z.string().min(3, "Mesajul este obligatoriu"),
  is_public: z.boolean(),
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profileId = await getCurrentProfileId();

    if (!profileId) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = await params;
    const admin = createAdminClient();

    const { data: existing, error: existingError } = await admin
      .from("requests")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "Cererea nu a fost găsită." },
        { status: 404 }
      );
    }

    const type = parsed.data.is_public ? "comment_public" : "comment_internal";

    const { error } = await admin.from("request_updates").insert({
      request_id: id,
      type,
      message: parsed.data.message,
      is_public: parsed.data.is_public,
      created_by: profileId,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Nu am putut salva comentariul." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("COMMENT POST ERROR:", error);

    return NextResponse.json(
      { error: "Comentariul nu a putut fi procesat." },
      { status: 500 }
    );
  }
}