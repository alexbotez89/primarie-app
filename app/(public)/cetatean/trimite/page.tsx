"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/public/location-picker";

type FormState = {
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  title: string;
  category: string;
  district: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export default function TrimiteCererePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    citizen_name: "",
    citizen_email: "",
    citizen_phone: "",
    title: "",
    category: "Infrastructură",
    district: "Centru",
    description: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  async function handleSubmit() {
    console.log("SUBMIT CLICKED");
    console.log("FORM DATA:", form);

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/public/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("RESPONSE STATUS:", res.status);

      const text = await res.text();

      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { error: text || "Răspuns invalid de la server." };
      }

      setLoading(false);

      if (!res.ok) {
        const message =
          data?.error?.fieldErrors?.citizen_name?.[0] ||
          data?.error?.fieldErrors?.citizen_email?.[0] ||
          data?.error?.fieldErrors?.title?.[0] ||
          data?.error?.fieldErrors?.description?.[0] ||
          data?.error?.fieldErrors?.category?.[0] ||
          data?.error?.fieldErrors?.district?.[0] ||
          data?.error?.formErrors?.[0] ||
          (typeof data?.error === "string" ? data.error : null) ||
          "A apărut o eroare.";

        setError(message);
        return;
      }

      router.push(
        `/cetatean/tracking?code=${encodeURIComponent(
          data.code
        )}&email=${encodeURIComponent(form.citizen_email)}`
      );
    } catch (err) {
      console.error("SUBMIT CATCH ERROR:", err);
      setLoading(false);
      setError("A apărut o eroare la trimiterea formularului.");
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-semibold">Depune o cerere</h1>

      <div className="space-y-4 rounded-2xl border bg-white p-6">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Nume complet"
          value={form.citizen_name}
          onChange={(e) =>
            setForm({ ...form, citizen_name: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Email"
          value={form.citizen_email}
          onChange={(e) =>
            setForm({ ...form, citizen_email: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Telefon"
          value={form.citizen_phone}
          onChange={(e) =>
            setForm({ ...form, citizen_phone: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Titlu cerere"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Categorie"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Cartier / zonă"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Adresă"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <textarea
          className="min-h-[140px] w-full rounded-xl border p-3"
          placeholder="Descriere"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Selectează locația pe hartă
          </label>

          <LocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={({ latitude, longitude }) =>
              setForm({ ...form, latitude, longitude })
            }
          />
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Se trimite..." : "Trimite cererea"}
        </button>
      </div>
    </main>
  );
}
