"use client";
import StatusBadge from "@/components/shared/status-badge";
import PriorityBadge from "@/components/shared/priority-badge";
import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

type MapRequest = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  district: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

type MapResponse = {
  requests?: MapRequest[];
  error?: string;
};

const LeafletMap = dynamic(() => import("./map-leaflet"), {
  ssr: false,
});

export default function MapClient() {
  const [requests, setRequests] = useState<MapRequest[]>([]);
  const [selected, setSelected] = useState<MapRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMapData() {
      try {
        const res = await fetch("/api/admin/map");
        const data: MapResponse = await res.json();

        if (!res.ok) {
          setError(data.error || "Nu am putut încărca harta.");
          setLoading(false);
          return;
        }

        setRequests(data.requests ?? []);
        setSelected((data.requests ?? [])[0] ?? null);
        setLoading(false);
      } catch {
        setError("Nu am putut încărca harta.");
        setLoading(false);
      }
    }

    loadMapData();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesPriority = priorityFilter
        ? item.priority === priorityFilter
        : true;
      return matchesStatus && matchesPriority;
    });
  }, [requests, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!selected && filteredRequests.length > 0) {
      setSelected(filteredRequests[0]);
    }

    if (
      selected &&
      !filteredRequests.find((item) => item.id === selected.id)
    ) {
      setSelected(filteredRequests[0] ?? null);
    }
  }, [filteredRequests, selected]);

  if (loading) {
    return <div className="text-slate-600">Se încarcă harta...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 xl:grid xl:grid-cols-[0.72fr_1.28fr]">
      <section className="order-1 space-y-4 md:space-y-6 xl:order-2">
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="h-[300px] md:h-[560px]">
            <LeafletMap
              requests={filteredRequests}
              selectedId={selected?.id ?? null}
              onSelect={(id: string) => {
                const found = filteredRequests.find((item) => item.id === id);
                if (found) setSelected(found);
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 md:p-6">
          <h2 className="mb-4 text-lg font-semibold md:text-xl">
            Detaliu marker selectat
          </h2>

          {selected ? (
            <div className="space-y-2 md:space-y-3">
              <div className="text-base font-medium md:text-lg">
                {selected.title}
              </div>
              <div className="text-sm text-slate-600">
                <strong>Cod:</strong> {selected.code}
              </div>
             <div className="flex flex-wrap gap-2">
  <StatusBadge status={selected.status} />
  <PriorityBadge priority={selected.priority} />
</div>
              <div className="text-sm text-slate-600">
                <strong>Categorie:</strong> {selected.category}
              </div>
              <div className="text-sm text-slate-600">
                <strong>Zonă:</strong> {selected.district}
              </div>
              <div className="text-sm text-slate-600 break-all">
                <strong>Coordonate:</strong> {selected.latitude}, {selected.longitude}
              </div>

              <Link
                href={`/admin/cereri/${selected.id}`}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-white"
              >
                Deschide cererea
              </Link>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              Selectează un marker sau o cerere din listă.
            </div>
          )}
        </div>
      </section>

      <section className="order-2 space-y-4 rounded-2xl border bg-white p-4 xl:order-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-xl">Filtre</h2>
          <div className="text-sm text-slate-500">
            {filteredRequests.length} rezultate
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border p-3 text-base"
        >
          <option value="">Toate statusurile</option>
          <option value="Nouă">Nouă</option>
          <option value="În verificare">În verificare</option>
          <option value="Alocată">Alocată</option>
          <option value="În lucru">În lucru</option>
          <option value="Rezolvată">Rezolvată</option>
          <option value="Respinsă">Respinsă</option>
          <option value="Escaladată">Escaladată</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full rounded-xl border p-3 text-base"
        >
          <option value="">Toate prioritățile</option>
          <option value="Scăzută">Scăzută</option>
          <option value="Medie">Medie</option>
          <option value="Ridicată">Ridicată</option>
          <option value="Critică">Critică</option>
        </select>

        <div className="max-h-[360px] space-y-3 overflow-auto pr-1 md:max-h-[540px]">
          {filteredRequests.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`w-full rounded-2xl border p-4 text-left ${
                selected?.id === item.id
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="font-medium">{item.title}</div>
              <div className="mt-1 text-sm text-slate-500">
                {item.code} · {item.status} · {item.priority}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {item.category} · {item.district}
              </div>
            </button>
          ))}

          {!filteredRequests.length ? (
            <div className="rounded-xl border p-4 text-sm text-slate-500">
              Nu există cereri cu coordonate pentru filtrele selectate.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}