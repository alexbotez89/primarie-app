import { CitizenRequest, initialRequests } from "@/lib/demo-data";

const STORAGE_KEY = "primarie-demo-requests";

export function loadRequests(): CitizenRequest[] {
  if (typeof window === "undefined") return initialRequests;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialRequests;

  try {
    const parsed = JSON.parse(raw) as CitizenRequest[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialRequests;
  } catch {
    return initialRequests;
  }
}

export function saveRequests(requests: CitizenRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}
