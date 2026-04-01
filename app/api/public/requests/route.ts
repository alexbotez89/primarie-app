import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRequestSchema } from "@/lib/validation/request";
import { generateRequestCode } from "@/lib/utils/code";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    let created = null;
    let insertError = null;

    for (let i = 0; i < 5; i++) {
      const code = generateRequestCode();

      const { data, error } = await supabase
        .from("requests")
        .insert({
          code,
          citizen_name: parsed.data.citizen_name,
          citizen_email: parsed.data.citizen_email,
          citizen_phone: parsed.data.citizen_phone ?? null,
          title: parsed.data.title,
          description: parsed.data.description,
          category: parsed.data.category,
          district: parsed.data.district,
          address: parsed.data.address ?? null,
          latitude: parsed.data.latitude ?? null,
          longitude: parsed.data.longitude ?? null,
          channel: "web",
          status: "Nouă",
          priority: "Medie",
        })
        .select("id, code, status, estimated_resolution_date")
        .single();

      if (!error && data) {
        created = data;
        insertError = null;
        break;
      }

      insertError = error;
    }

    if (!created) {
      return NextResponse.json(
        {
          error:
            insertError?.message || "Nu am putut crea cererea.",
        },
        { status: 500 }
      );
    }

    await supabase.from("request_updates").insert({
      request_id: created.id,
      type: "created",
      message: "Cererea a fost înregistrată în platformă.",
      is_public: true,
    });

    return NextResponse.json({
      success: true,
      code: created.code,
      status: created.status,
      estimated_resolution_date: created.estimated_resolution_date,
    });
  } catch {
    return NextResponse.json(
      { error: "Cererea nu a putut fi procesată." },
      { status: 500 }
    );
  }
}