
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Pantry } from './types';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { defaultIcon, getRandomIcon } from './marker-icons';

interface PantryMapProps {
  pantries: Pantry[];
  onViewDetails: (pantry: Pantry) => void;
}

export function PantryMap({ pantries = [], onViewDetails }: PantryMapProps) {
  const markerRefs = React.useRef<{ [key: number]: L.Marker | null }>({});

  const handleMarkerClick = (pantry: Pantry) => {
    const marker = markerRefs.current[pantry.id];
    if (marker) {
      marker.setIcon(getRandomIcon());
    }
  };

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pantries.map(pantry => (
        <Marker
          key={pantry.id}
          position={[pantry.lat, pantry.lng]}
          icon={defaultIcon}
          ref={el => markerRefs.current[pantry.id] = el}
          eventHandlers={{
            click: () => handleMarkerClick(pantry),
          }}
        >
          <Popup>
            <div className="font-sans bg-black text-white p-2 rounded-md">
              <h3 className="font-bold text-base mb-1">{pantry.name}</h3>
              <p className="text-sm text-slate-300 m-0">{pantry.address}</p>
              <p className="text-sm text-slate-100 mt-2 m-0">{pantry.notes}</p>
              <Button
                size="sm"
                className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onViewDetails(pantry)}
              >
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
