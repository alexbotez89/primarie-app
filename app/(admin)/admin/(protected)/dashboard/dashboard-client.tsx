"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

type DashboardResponse = {
  kpis: {
    totalRequests: number;
    newToday: number;
    inProgress: number;
    resolved: number;
    critical: number;
  };
  statusDistribution: Array<{ name: string; value: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  dailyRequests: Array<{ date: string; value: number }>;
  error?: string;
};

function KpiCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();

        if (!res.ok) {
          setError(json?.error || "Nu am putut încărca dashboard-ul.");
          setLoading(false);
          return;
        }

        setData(json);
        setLoading(false);
      } catch {
        setError("Nu am putut încărca dashboard-ul.");
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-slate-600">Se încarcă dashboard-ul...</div>;
  }

  if (error || !data) {
    return <div className="text-red-600">{error || "Eroare necunoscută."}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Cereri totale" value={data.kpis.totalRequests} />
        <KpiCard title="Cereri noi azi" value={data.kpis.newToday} />
        <KpiCard title="În lucru" value={data.kpis.inProgress} />
        <KpiCard title="Rezolvate" value={data.kpis.resolved} />
        <KpiCard title="Critice" value={data.kpis.critical} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Cereri în ultimele 7 zile</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(String(value)).toLocaleDateString("ro-RO")
                  }
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Distribuție pe status</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={data.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Top categorii</h2>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.categoryDistribution}
              layout="vertical"
              margin={{ left: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}