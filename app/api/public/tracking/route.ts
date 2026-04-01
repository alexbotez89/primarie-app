import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackRequestSchema } from "@/lib/validation/request";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: req, error } = await supabase
      .from("requests")
      .select(
        "id, code, title, status, priority, category, district, estimated_resolution_date, created_at"
      )
      .eq("code", parsed.data.code)
      .eq("citizen_email", parsed.data.email)
      .single();

    if (error || !req) {
      return NextResponse.json(
        { error: "Cererea nu a fost găsită." },
        { status: 404 }
      );
    }

    const { data: updates } = await supabase
      .from("request_updates")
      .select("id, type, message, created_at")
      .eq("request_id", req.id)
      .eq("is_public", true)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      request: req,
      updates: updates ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Tracking indisponibil momentan." },
      { status: 500 }
    );
  }
}