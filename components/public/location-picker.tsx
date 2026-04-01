"use client";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("./location-picker-map"), {
  ssr: false,
});

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: { latitude: number; longitude: number }) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="h-[360px]">
          <LocationPickerMap
            latitude={latitude}
            longitude={longitude}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-600">
        {latitude !== null && longitude !== null ? (
          <>
            <strong>Coordonate selectate:</strong> {latitude.toFixed(6)},{" "}
            {longitude.toFixed(6)}
          </>
        ) : (
          "Click pe hartă pentru a seta locația sesizării."
        )}
      </div>
    </div>
  );
}