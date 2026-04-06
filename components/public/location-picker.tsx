"use client";

import "leaflet/dist/leaflet.css";

import { useState } from "react";
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
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState("");

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setGeoMessage("Browserul nu suportă geolocația.");
      return;
    }

    setGeoLoading(true);
    setGeoMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeoLoading(false);
        setGeoMessage("Locația a fost detectată automat.");
      },
      () => {
        setGeoLoading(false);
        setGeoMessage(
          "Nu am putut obține locația automat. Poți plasa pin-ul manual pe hartă."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          {geoLoading ? "Se detectează..." : "Folosește locația mea"}
        </button>

        {geoMessage ? (
          <div className="text-sm text-slate-600">{geoMessage}</div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="h-[260px] md:h-[360px]">
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
          "Apasă pe „Folosește locația mea” sau click pe hartă pentru a seta locația sesizării."
        )}
      </div>
    </div>
  );
}