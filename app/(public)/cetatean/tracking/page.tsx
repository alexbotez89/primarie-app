import { Suspense } from "react";
import TrackingClient from "./tracking-client";

export default function TrackingPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl p-6">Se încarcă...</main>}>
      <TrackingClient />
    </Suspense>
  );
}
