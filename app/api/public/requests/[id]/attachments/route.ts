import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fișier lipsă." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sunt acceptate doar imagini JPG, PNG sau WEBP." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imaginea trebuie să aibă maxim 5MB." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: existingRequest } = await admin
      .from("requests")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Cererea nu a fost găsită." },
        { status: 404 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${id}/${Date.now()}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("request-attachments")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Nu am putut încărca imaginea." },
        { status: 500 }
      );
    }

    const { data: publicData } = admin.storage
      .from("request-attachments")
      .getPublicUrl(filePath);

    const publicUrl = publicData.publicUrl;

    const { error: insertError } = await admin
      .from("request_attachments")
      .insert({
        request_id: id,
        file_path: filePath,
        file_name: file.name,
        mime_type: file.type,
        public_url: publicUrl,
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Imaginea a fost urcată, dar nu a putut fi salvată în baza de date." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      public_url: publicUrl,
      file_name: file.name,
    });
  } catch (error) {
    console.error("ATTACHMENT UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Imaginea nu a putut fi procesată." },
      { status: 500 }
    );
  }
}