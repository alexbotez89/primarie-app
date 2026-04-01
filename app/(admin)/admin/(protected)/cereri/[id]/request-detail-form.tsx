"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestType = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  district: string;
  estimated_resolution_date: string | null;
};

type UpdateType = {
  id: string;
  type: string;
  message: string;
  is_public: boolean;
  created_at: string;
};

export default function RequestDetailForm({
  request,
  updates,
}: {
  request: RequestType;
  updates: UpdateType[];
}) {
  const router = useRouter();

  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [estimatedResolutionDate, setEstimatedResolutionDate] = useState(
    request.estimated_resolution_date ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [comment, setComment] = useState("");
  const [isPublicComment, setIsPublicComment] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/admin/requests/${request.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        priority,
        estimated_resolution_date: estimatedResolutionDate || null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data?.error || "Nu am putut salva modificările.");
      return;
    }

    setMessage("Modificările au fost salvate.");
    router.refresh();
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCommentLoading(true);
    setCommentMessage("");

    const res = await fetch(`/api/admin/requests/${request.id}/updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: comment,
        is_public: isPublicComment,
      }),
    });

    const data = await res.json();
    setCommentLoading(false);

    if (!res.ok) {
      const errorMessage =
        data?.error?.fieldErrors?.message?.[0] ||
        data?.error?.formErrors?.[0] ||
        (typeof data?.error === "string" ? data.error : null) ||
        "Nu am putut salva comentariul.";

      setCommentMessage(errorMessage);
      return;
    }

    setComment("");
    setCommentMessage("Comentariul a fost salvat.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Actualizare cerere</h2>

        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <select
            className="w-full rounded-xl border p-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Nouă</option>
            <option>În verificare</option>
            <option>Alocată</option>
            <option>În lucru</option>
            <option>Rezolvată</option>
            <option>Respinsă</option>
            <option>Escaladată</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Prioritate</label>
          <select
            className="w-full rounded-xl border p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Scăzută</option>
            <option>Medie</option>
            <option>Ridicată</option>
            <option>Critică</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Termen estimat rezolvare
          </label>
          <input
            type="date"
            className="w-full rounded-xl border p-3"
            value={estimatedResolutionDate}
            onChange={(e) => setEstimatedResolutionDate(e.target.value)}
          />
        </div>

        {message ? <div className="text-sm text-slate-700">{message}</div> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Se salvează..." : "Salvează modificările"}
        </button>
      </form>

      <form
        onSubmit={handleCommentSubmit}
        className="space-y-4 rounded-2xl border bg-white p-6"
      >
        <h2 className="text-xl font-semibold">Adaugă comentariu</h2>

        <textarea
          className="min-h-[120px] w-full rounded-xl border p-3"
          placeholder="Scrie un comentariu..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={isPublicComment}
              onChange={() => setIsPublicComment(true)}
            />
            Public
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={!isPublicComment}
              onChange={() => setIsPublicComment(false)}
            />
            Intern
          </label>
        </div>

        {commentMessage ? (
          <div className="text-sm text-slate-700">{commentMessage}</div>
        ) : null}

        <button
          type="submit"
          disabled={commentLoading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {commentLoading ? "Se salvează..." : "Salvează comentariul"}
        </button>
      </form>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Istoric actualizări</h2>

        <div className="space-y-3">
          {updates.length === 0 ? (
            <div className="text-sm text-slate-500">Nu există actualizări încă.</div>
          ) : (
            updates.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <div className="font-medium">{item.message}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {item.is_public ? "Public" : "Intern"} ·{" "}
                  {new Date(item.created_at).toLocaleString("ro-RO")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}