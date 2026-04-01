import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function isAuthenticatedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !!user;
}

export async function GET() {
  try {
    const authenticated = await isAuthenticatedAdmin();

    if (!authenticated) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from("requests")
      .select(
        "id, code, title, status, priority, category, district, latitude, longitude, created_at"
      )
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Nu am putut încărca cererile pentru hartă." },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests: data ?? [] });
  } catch (error) {
    console.error("MAP API ERROR:", error);
    return NextResponse.json(
      { error: "Eroare la încărcarea hărții." },
      { status: 500 }
    );
  }
}