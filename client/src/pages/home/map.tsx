
import * as React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export function PantryMap() {
  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="leaflet-tile-pane"
      />
    </MapContainer>
  );
}
