"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

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
};

function FitBounds({ requests }: { requests: MapRequest[] }) {
  const map = useMap();

  useEffect(() => {
    if (!requests.length) return;

    if (requests.length === 1) {
      map.setView([requests[0].latitude, requests[0].longitude], 15);
      return;
    }

    const bounds = L.latLngBounds(
      requests.map((item) => [item.latitude, item.longitude] as [number, number])
    );

    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, requests]);

  return null;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

export default function MapLeaflet({
  requests,
  selectedId,
  onSelect,
}: {
  requests: MapRequest[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[44.4268, 26.1025]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds requests={requests} />

      {requests.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={defaultIcon}
          eventHandlers={{
            click: () => onSelect(item.id),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <div className="font-medium">{item.title}</div>
              <div>{item.code}</div>
              <div>{item.status}</div>
              <div>{item.priority}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}