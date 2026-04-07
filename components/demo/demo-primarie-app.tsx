"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import InstallPwaButton from "@/components/shared/install-pwa-button";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Home,
  MapPin,
  Search,
  Send,
  TimerReset,
  User,
  Wrench,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { NativeSelect } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { categories, CitizenRequest, districts, initialRequests, kpiCards, monthlyResolution, pieData, priorities, statusStyles } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { loadRequests, saveRequests } from "@/lib/storage";

function StatCard({ title, value, delta, icon: Icon }: { title: string; value: string; delta: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{delta} față de luna trecută</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMap({ requests, selectedId, onSelect }: { requests: CitizenRequest[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          Harta problemelor raportate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-[10%] top-[14%] h-[1px] w-[72%] bg-slate-200" />
            <div className="absolute left-[18%] top-[38%] h-[1px] w-[65%] bg-slate-200" />
            <div className="absolute left-[8%] top-[68%] h-[1px] w-[78%] bg-slate-200" />
            <div className="absolute left-[22%] top-[6%] h-[80%] w-[1px] bg-slate-200" />
            <div className="absolute left-[50%] top-[12%] h-[74%] w-[1px] bg-slate-200" />
            <div className="absolute left-[76%] top-[18%] h-[60%] w-[1px] bg-slate-200" />
          </div>

          <div className="absolute left-[37%] top-[8%] rounded-full border bg-white/90 px-3 py-1 text-xs shadow">Nord</div>
          <div className="absolute left-[12%] top-[42%] rounded-full border bg-white/90 px-3 py-1 text-xs shadow">Vest</div>
          <div className="absolute left-[44%] top-[44%] rounded-full border bg-white/90 px-3 py-1 text-xs shadow">Centru</div>
          <div className="absolute right-[8%] top-[40%] rounded-full border bg-white/90 px-3 py-1 text-xs shadow">Est</div>
          <div className="absolute left-[40%] bottom-[10%] rounded-full border bg-white/90 px-3 py-1 text-xs shadow">Sud</div>

          {requests.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelect(item.id)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-lg transition-all",
                selectedId === item.id ? "z-20 h-5 w-5 ring-4 ring-slate-300" : "h-4 w-4 hover:scale-110",
                item.status === "Rezolvată"
                  ? "bg-emerald-500"
                  : item.priority === "Critică"
                    ? "bg-rose-500"
                    : item.status === "În lucru"
                      ? "bg-blue-500"
                      : "bg-amber-500",
              )}
              style={{ left: `${item.lng}%`, top: `${item.lat}%` }}
              aria-label={item.title}
              title={item.title}
            />
          ))}

          <div className="absolute bottom-3 left-3 rounded-xl border bg-white/90 px-3 py-2 text-xs text-slate-700 shadow">
            <div className="mb-1 font-medium">Legendă</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> În lucru</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Noi / verificare</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Critice</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Rezolvate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DemoPrimarieApp() {
  const [requests, setRequests] = useState<CitizenRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState("portal");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("toate");
  const [districtFilter, setDistrictFilter] = useState("toate");
  const [selectedId, setSelectedId] = useState(initialRequests[0].id);
  const [trackingId, setTrackingId] = useState("PMR-2026-00124");
  const [form, setForm] = useState({
    citizen: "",
    email: "",
    phone: "",
    title: "",
    category: "Infrastructură",
    district: "Centru",
    description: "",
  });

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesQuery = [item.id, item.title, item.category, item.citizen, item.district].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "toate" ? true : item.status === statusFilter;
      const matchesDistrict = districtFilter === "toate" ? true : item.district === districtFilter;
      return matchesQuery && matchesStatus && matchesDistrict;
    });
  }, [requests, query, statusFilter, districtFilter]);

  const selectedRequest = requests.find((r) => r.id === selectedId) ?? requests[0];
  const trackedRequest = requests.find((r) => r.id.toLowerCase() === trackingId.toLowerCase());

  const categoryData = useMemo(() => {
    const counts = requests.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [requests]);

  const handleSubmit = () => {
    if (!form.citizen || !form.title || !form.description) return;

    const nextNumber = String(128 + requests.length).padStart(5, "0");
    const newRequest: CitizenRequest = {
      id: `PMR-2026-${nextNumber}`,
      citizen: form.citizen,
      email: form.email,
      phone: form.phone,
      title: form.title,
      category: form.category,
      status: "Nouă",
      priority: "Medie",
      district: form.district,
      date: "2026-03-18",
      eta: "2026-03-25",
      channel: "Web",
      assigned: "În alocare",
      description: form.description,
      lat: 20 + Math.round(Math.random() * 60),
      lng: 18 + Math.round(Math.random() * 62),
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    setSelectedId(newRequest.id);
    setTrackingId(newRequest.id);
    setActiveTab("tracking");
    setForm({ citizen: "", email: "", phone: "", title: "", category: "Infrastructură", district: "Centru", description: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Home className="h-4 w-4" />
                Demo web app pentru primării · Servicii digitale cetățenești
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Portal Cetățean + Dashboard Operațional Primărie</h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                Formulare de sesizare și cereri, urmărire status în timp real, analiză a rezoluțiilor și hartă interactivă a problemelor din oraș.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-[360px]">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">SLA respectat</div>
                <div className="mt-1 text-2xl font-semibold">94%</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">Utilizatori activi</div>
                <div className="mt-1 text-2xl font-semibold">3.842</div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mb-6 flex flex-wrap gap-3">
  <InstallPwaButton />
</div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm md:grid-cols-4">
            <TabsTrigger value="portal" className="rounded-xl">Cereri cetățenești</TabsTrigger>
            <TabsTrigger value="tracking" className="rounded-xl">Tracking status</TabsTrigger>
            <TabsTrigger value="dashboard" className="rounded-xl">Dashboard rezoluții</TabsTrigger>
            <TabsTrigger value="harta" className="rounded-xl">Hărți probleme</TabsTrigger>
          </TabsList>

          <TabsContent value="portal" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Send className="h-5 w-5" />
                    Depune o cerere / sesizare nouă
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nume complet</label>
                      <Input value={form.citizen} onChange={(e) => setForm({ ...form, citizen: e.target.value })} placeholder="Ex: Andrei Popescu" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nume@email.ro" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Telefon</label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07xx xxx xxx" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Titlu cerere</label>
                      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Groapă pe carosabil" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Categorie</label>
                      <NativeSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                      </NativeSelect>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Zonă / cartier</label>
                      <NativeSelect value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                        {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                      </NativeSelect>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Descriere detaliată</label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrie problema, locația și impactul asupra cetățenilor..." className="min-h-[140px]" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-600">După trimitere, cetățeanul primește un număr unic de înregistrare și poate urmări evoluția cazului.</div>
                    <Button onClick={handleSubmit} className="rounded-xl">Trimite cererea</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Beneficii pentru primărie</CardTitle></CardHeader>
                  <CardContent className="grid gap-4">
                    {[
                      ["Workflow digital", "Înregistrare automată, alocare pe departamente și SLA configurabil."],
                      ["Transparență", "Cetățenii văd statusul, termenul estimat și istoricul acțiunilor."],
                      ["Analitice", "Dashboard cu volume, timp de răspuns, zone fierbinți și tipologii de probleme."],
                      ["Decizii rapide", "Hartă operațională pentru prioritizare în teren și escaladare."],
                    ].map(([title, desc]) => (
                      <div key={title} className="rounded-2xl border border-slate-200 p-4">
                        <div className="font-medium text-slate-900">{title}</div>
                        <div className="mt-1 text-sm text-slate-600">{desc}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-lg">Exemple de categorii</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {["Drumuri", "Iluminat", "Parcări", "Parcuri", "Deșeuri", "Zgomot", "Canalizare", "Siguranță"].map((tag) => (
                      <Badge key={tag} className="rounded-full px-3 py-1">{tag}</Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Search className="h-5 w-5" />Urmărește o cerere</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Introdu numărul de înregistrare" />
                  {trackedRequest ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Număr cerere</div>
                          <div className="mt-1 font-semibold text-slate-900">{trackedRequest.id}</div>
                        </div>
                        <Badge className={cn("rounded-full", statusStyles[trackedRequest.status])}>{trackedRequest.status}</Badge>
                      </div>
                      <div className="mt-4 space-y-3 text-sm">
                        <div><span className="text-slate-500">Titlu:</span> {trackedRequest.title}</div>
                        <div><span className="text-slate-500">Departament:</span> {trackedRequest.assigned}</div>
                        <div><span className="text-slate-500">Termen estimat:</span> {trackedRequest.eta}</div>
                        <div><span className="text-slate-500">Canal:</span> {trackedRequest.channel}</div>
                      </div>
                    </div>
                  ) : <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Nicio cerere găsită pentru codul introdus.</div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Flux operațional și istoric</CardTitle></CardHeader>
                <CardContent>
                  {trackedRequest ? (
                    <div className="space-y-6">
                      <div>
                        <div className="mb-3 flex items-center justify-between text-sm text-slate-600"><span>Progres estimat</span><span>{priorities[trackedRequest.priority]}%</span></div>
                        <Progress value={priorities[trackedRequest.priority]} className="h-3" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        {[
                          ["Cerere înregistrată", true, trackedRequest.date],
                          ["Validare automată", true, trackedRequest.date],
                          ["Alocare departament", trackedRequest.status !== "Nouă", trackedRequest.date],
                          ["Rezolvare", trackedRequest.status === "Rezolvată", trackedRequest.eta],
                        ].map(([label, done, date]) => (
                          <div key={String(label)} className="rounded-2xl border border-slate-200 p-4">
                            <div className={cn("mb-3 inline-flex rounded-full p-2", done ? "bg-emerald-100" : "bg-slate-100")}>
                              {done ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <Clock3 className="h-4 w-4 text-slate-600" />}
                            </div>
                            <div className="text-sm font-medium">{label}</div>
                            <div className="mt-1 text-xs text-slate-500">{String(date)}</div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 font-medium">Istoric actualizări</div>
                        <div className="space-y-4 text-sm">
                          <div className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400" /><div><div className="font-medium">Cerere primită de platformă</div><div className="text-slate-500">Datele au fost validate și înregistrate automat.</div></div></div>
                          <div className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" /><div><div className="font-medium">Trimisă către {trackedRequest.assigned}</div><div className="text-slate-500">Responsabilul de caz a fost notificat și termenul de rezolvare a fost estimat.</div></div></div>
                          <div className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" /><div><div className="font-medium">Status curent: {trackedRequest.status}</div><div className="text-slate-500">Cetățeanul poate primi notificări email/SMS la fiecare schimbare de status.</div></div></div>
                        </div>
                      </div>
                    </div>
                  ) : <div className="text-sm text-slate-500">Introdu un cod valid pentru a vedea istoricul.</div>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpiCards.map((card) => <StatCard key={card.title} {...card} />)}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="h-5 w-5" />Evoluție cereri vs. rezolvări</CardTitle></CardHeader>
                <CardContent className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyResolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="noi" stroke="#64748b" strokeWidth={3} />
                      <Line type="monotone" dataKey="rezolvate" stroke="#0f172a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Distribuția statusurilor</CardTitle></CardHeader>
                <CardContent className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={108} paddingAngle={3}>
                        {pieData.map((entry, index) => {
                          const colors = ["#0f172a", "#3b82f6", "#f59e0b", "#94a3b8", "#ef4444"];
                          return <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader><CardTitle className="text-lg">Top categorii sesizări</CardTitle></CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 24 }}>
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#0f172a" radius={[0, 10, 10, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Cazuri recente și SLA</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {requests.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-1 text-sm text-slate-500">{item.id} · {item.district} · {item.assigned}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={cn("rounded-full", statusStyles[item.status])}>{item.status}</Badge>
                          <div className="text-sm text-slate-600">ETA: {item.eta}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="harta" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-lg"><Filter className="h-5 w-5" />Filtrare probleme</CardTitle>
                    <Badge className="rounded-full">{filteredRequests.length} rezultate</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Caută după cod, titlu, zonă..." />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    <NativeSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="toate">Toate statusurile</option>
                      <option value="Nouă">Nouă</option>
                      <option value="În verificare">În verificare</option>
                      <option value="În lucru">În lucru</option>
                      <option value="Escaladată">Escaladată</option>
                      <option value="Rezolvată">Rezolvată</option>
                    </NativeSelect>
                    <NativeSelect value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
                      <option value="toate">Toate zonele</option>
                      {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                    </NativeSelect>
                  </div>

                  <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                    {filteredRequests.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={cn("w-full rounded-2xl border p-4 text-left transition-all", selectedId === item.id ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="mt-1 text-sm text-slate-500">{item.id} · {item.category} · {item.district}</div>
                          </div>
                          <Badge className={cn("rounded-full", statusStyles[item.status])}>{item.status}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <MiniMap requests={filteredRequests} selectedId={selectedId} onSelect={setSelectedId} />

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Wrench className="h-5 w-5" />Fișă incident selectat</CardTitle></CardHeader>
                  <CardContent>
                    {selectedRequest ? (
                      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-semibold">{selectedRequest.title}</h3>
                              <Badge className={cn("rounded-full", statusStyles[selectedRequest.status])}>{selectedRequest.status}</Badge>
                            </div>
                            <p className="mt-2 text-slate-600">{selectedRequest.description}</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {[
                              ["Categorie", selectedRequest.category],
                              ["Zonă", selectedRequest.district],
                              ["Departament", selectedRequest.assigned],
                              ["Termen estimat", selectedRequest.eta],
                            ].map(([label, value]) => (
                              <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm text-slate-500">{label}</div>
                                <div className="mt-1 font-medium">{String(value)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><User className="h-4 w-4" />Date caz</div>
                          <div className="space-y-3 text-sm">
                            <div><span className="text-slate-500">Cetățean:</span> {selectedRequest.citizen}</div>
                            <div><span className="text-slate-500">Cod:</span> {selectedRequest.id}</div>
                            <div><span className="text-slate-500">Prioritate:</span> {selectedRequest.priority}</div>
                            <div><span className="text-slate-500">Data înregistrării:</span> {selectedRequest.date}</div>
                            <div><span className="text-slate-500">Canal:</span> {selectedRequest.channel}</div>
                          </div>
                          <Button className="mt-5 w-full rounded-xl">Deschide detaliu operațional</Button>
                        </div>
                      </div>
                    ) : <div className="text-sm text-slate-500">Selectează un incident din listă.</div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
