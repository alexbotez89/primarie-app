import { AlertTriangle, CheckCircle2, FileText, TimerReset } from "lucide-react";

export type RequestStatus = "Nouă" | "În verificare" | "În lucru" | "Escaladată" | "Rezolvată";
export type RequestPriority = "Scăzută" | "Medie" | "Ridicată" | "Critică";

export type CitizenRequest = {
  id: string;
  citizen: string;
  email?: string;
  phone?: string;
  title: string;
  category: string;
  status: RequestStatus;
  priority: RequestPriority;
  district: string;
  date: string;
  eta: string;
  channel: string;
  assigned: string;
  description: string;
  lat: number;
  lng: number;
};

export const initialRequests: CitizenRequest[] = [
  {
    id: "PMR-2026-00124",
    citizen: "Andrei Popescu",
    title: "Groapă periculoasă pe Strada Lalelelor",
    category: "Infrastructură",
    status: "În lucru",
    priority: "Ridicată",
    district: "Centru",
    date: "2026-03-12",
    eta: "2026-03-20",
    channel: "Web",
    assigned: "Serviciul Drumuri",
    description: "Groapă adâncă în apropierea trecerii de pietoni. Prezintă risc pentru autoturisme și bicicliști.",
    lat: 42,
    lng: 58,
  },
  {
    id: "PMR-2026-00125",
    citizen: "Maria Ionescu",
    title: "Iluminat public defect pe Aleea Parcului",
    category: "Iluminat public",
    status: "Nouă",
    priority: "Medie",
    district: "Nord",
    date: "2026-03-16",
    eta: "2026-03-23",
    channel: "Mobil",
    assigned: "Iluminat și Utilități",
    description: "Trei stâlpi fără lumină între intrarea principală și locul de joacă.",
    lat: 64,
    lng: 28,
  },
  {
    id: "PMR-2026-00118",
    citizen: "Ioana Dobre",
    title: "Colectare deșeuri întârziată",
    category: "Salubritate",
    status: "Rezolvată",
    priority: "Medie",
    district: "Vest",
    date: "2026-03-08",
    eta: "2026-03-11",
    channel: "Telefonic",
    assigned: "Salubritate",
    description: "Containerele au rămas pline de două zile în zona blocurilor 14-18.",
    lat: 18,
    lng: 36,
  },
  {
    id: "PMR-2026-00110",
    citizen: "Radu Matei",
    title: "Copac rupt după furtună",
    category: "Spații verzi",
    status: "Escaladată",
    priority: "Critică",
    district: "Sud",
    date: "2026-03-06",
    eta: "2026-03-18",
    channel: "Web",
    assigned: "Spații Verzi + ISU",
    description: "Ramuri mari blochează trotuarul și ating cablurile de telecomunicații.",
    lat: 54,
    lng: 80,
  },
  {
    id: "PMR-2026-00127",
    citizen: "Elena Stan",
    title: "Marcaje pietonale șterse",
    category: "Siguranță rutieră",
    status: "În verificare",
    priority: "Ridicată",
    district: "Est",
    date: "2026-03-17",
    eta: "2026-03-24",
    channel: "Web",
    assigned: "Mobilitate Urbană",
    description: "Marcajul din fața școlii este aproape inexistent, vizibilitate foarte redusă.",
    lat: 78,
    lng: 55,
  },
  {
    id: "PMR-2026-00102",
    citizen: "Mihai Ene",
    title: "Sesizare câini fără stăpân",
    category: "Ordine publică",
    status: "Rezolvată",
    priority: "Ridicată",
    district: "Centru",
    date: "2026-03-04",
    eta: "2026-03-07",
    channel: "Call center",
    assigned: "Serviciul Protecția Animalelor",
    description: "Două animale agresive în apropierea pieței agroalimentare.",
    lat: 48,
    lng: 48,
  },
];

export const statusStyles: Record<RequestStatus, string> = {
  "Nouă": "bg-slate-100 text-slate-800",
  "În verificare": "bg-amber-100 text-amber-800",
  "În lucru": "bg-blue-100 text-blue-800",
  "Escaladată": "bg-rose-100 text-rose-800",
  "Rezolvată": "bg-emerald-100 text-emerald-800",
};

export const priorities: Record<RequestPriority, number> = {
  "Critică": 100,
  "Ridicată": 75,
  "Medie": 50,
  "Scăzută": 25,
};

export const monthlyResolution = [
  { name: "Oct", rezolvate: 126, noi: 141 },
  { name: "Nov", rezolvate: 132, noi: 138 },
  { name: "Dec", rezolvate: 120, noi: 127 },
  { name: "Ian", rezolvate: 147, noi: 153 },
  { name: "Feb", rezolvate: 158, noi: 161 },
  { name: "Mar", rezolvate: 96, noi: 102 },
];

export const pieData = [
  { name: "Rezolvate", value: 54 },
  { name: "În lucru", value: 23 },
  { name: "În verificare", value: 12 },
  { name: "Noi", value: 7 },
  { name: "Escaladate", value: 4 },
];

export const kpiCards = [
  { title: "Cereri totale", value: "1.284", delta: "+8.2%", icon: FileText },
  { title: "Timp mediu răspuns", value: "2,4 zile", delta: "-0.6 zile", icon: TimerReset },
  { title: "Rată rezolvare", value: "91%", delta: "+3.4%", icon: CheckCircle2 },
  { title: "Cazuri critice", value: "14", delta: "-2", icon: AlertTriangle },
];

export const categories = [
  "Infrastructură",
  "Iluminat public",
  "Salubritate",
  "Spații verzi",
  "Siguranță rutieră",
  "Ordine publică",
];

export const districts = ["Centru", "Nord", "Sud", "Est", "Vest"];
