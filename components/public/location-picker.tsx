"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("./location-picker-map"), {
  ssr: false,
});

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
      (error) => {
        setGeoLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoMessage(
              "Accesul la locație a fost refuzat. Poți căuta localitatea sau plasa pin-ul manual."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoMessage(
              "Locația nu este disponibilă momentan. Poți căuta localitatea sau plasa pin-ul manual."
            );
            break;
          case error.TIMEOUT:
            setGeoMessage(
              "Detectarea locației a durat prea mult. Poți căuta localitatea sau plasa pin-ul manual."
            );
            break;
          default:
            setGeoMessage(
              "Nu am putut obține locația automat. Poți căuta localitatea sau plasa pin-ul manual."
            );
        }

        console.error("GEOLOCATION ERROR:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  useEffect(() => {
    async function fetchSuggestions(query: string) {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      setSearchLoading(true);

      try {
        const encoded = encodeURIComponent(`${query}, Romania`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=5&addressdetails=1`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("AUTOCOMPLETE ERROR:", error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectSuggestion(item: Suggestion) {
    const lat = Number(item.lat);
    const lon = Number(item.lon);

    setSearchQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);

    onChange({
      latitude: lat,
      longitude: lon,
    });

    setGeoMessage("Locația a fost găsită. Poți ajusta pin-ul pe hartă.");
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
      </div>

      <div ref={wrapperRef} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Caută localitate, comună sau adresă"
          className="w-full rounded-xl border p-3 text-base"
        />

        {searchLoading ? (
          <div className="mt-2 text-sm text-slate-500">Se caută sugestii...</div>
        ) : null}

        {showSuggestions && suggestions.length > 0 ? (
          <div className="absolute z-[1100] mt-2 max-h-64 w-full overflow-auto rounded-2xl border bg-white shadow-lg">
            {suggestions.map((item, index) => (
              <button
                key={`${item.lat}-${item.lon}-${index}`}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="block w-full border-b px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 last:border-b-0"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {geoMessage ? (
        <div className="text-sm text-slate-600">{geoMessage}</div>
      ) : null}

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
          "Poți folosi locația automată, căutarea după localitate/adresă sau click pe hartă pentru a seta locația sesizării."
        )}
      </div>
    </div>
  );
}