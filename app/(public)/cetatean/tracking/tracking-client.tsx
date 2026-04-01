"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type TrackingResponse = {
  request?: {
    code: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    district: string;
    estimated_resolution_date: string | null;
    created_at: string;
  };
  updates?: Array<{
    id: string;
    type: string;
    message: string;
    created_at: string;
  }>;
  error?: string;
};

export default function TrackingClient() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const initialEmail = searchParams.get("email") ?? "";

  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/public/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setResult(null);
      setError(data?.error || "Cererea nu a fost găsită.");
      return;
    }

    setResult(data);
  }

  useEffect(() => {
    if (initialCode && initialEmail) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Tracking cerere</h1>

      <form onSubmit={handleSearch} className="space-y-4 rounded-2xl border bg-white p-6">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Cod cerere"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Se caută..." : "Caută cererea"}
        </button>
      </form>

      {error ? <div className="mt-4 text-red-600">{error}</div> : null}

      {result?.request ? (
        <section className="mt-6 space-y-4">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-semibold">{result.request.title}</h2>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <div><strong>Cod:</strong> {result.request.code}</div>
              <div><strong>Status:</strong> {result.request.status}</div>
              <div><strong>Prioritate:</strong> {result.request.priority}</div>
              <div><strong>Categorie:</strong> {result.request.category}</div>
              <div><strong>Zonă:</strong> {result.request.district}</div>
              <div><strong>ETA:</strong> {result.request.estimated_resolution_date || "Nedefinit"}</div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Istoric actualizări</h3>

            <div className="space-y-3">
              {result.updates?.map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="font-medium">{item.message}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {new Date(item.created_at).toLocaleString("ro-RO")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}