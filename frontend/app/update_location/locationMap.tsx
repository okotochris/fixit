"use client";

import {MapContainer, TileLayer, Marker, useMapEvents, } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapClickHandlerProps {
  onSelect: (location: { lat: number; lng: number }) => void;
}

function MapClickHandler({ onSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

interface Props {
  location: {
    lat: number;
    lng: number;
  } | null;
  onSelect: (location: { lat: number; lng: number }) => void;
}

export default function LocationMap({
  location,
  onSelect,
}: Props) {
  return (
    <div className="h-[300px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[6.5244, 3.3792]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onSelect={onSelect} />

        {location && (
          <Marker position={[location.lat, location.lng]} />
        )}
      </MapContainer>
    </div>
  );
}