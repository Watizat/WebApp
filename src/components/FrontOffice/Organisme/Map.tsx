import L from 'leaflet';
import { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Organism } from '../../../@types/organism';
import { useAppState } from '../../../hooks/appState';
import '../Resultats/Map/Map.css';

export default function Map() {
  const [position, setPosition] = useState({ lat: 43.6, lng: 1.433333 });

  const { organismState } = useAppState();
  const organism = organismState.organism as Organism;

  useEffect(() => {
    if (organism.latitude && organism.longitude) {
      setPosition({ lat: organism.latitude, lng: organism.longitude });
    }
  }, [organism.latitude, organism.longitude]);

  return (
    <div className="rounded-lg shadow-sm lg:col-start-3 lg:row-end-1 bg-gray-50 ring-1 ring-gray-900/5">
      <MapContainer
        className="flex w-full h-[300px] rounded-lg"
        center={
          organism.latitude ? [organism.latitude, organism.longitude] : position
        }
        zoom={15}
        key={position.lat}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        {organism.latitude && (
          <Marker
            key={organism.id}
            position={[organism.latitude, organism.longitude]}
            icon={
              new L.DivIcon({
                className: 'custom-icon',
                html: `<div></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 33.5],
                popupAnchor: [0, -30],
              })
            }
          />
        )}
      </MapContainer>
    </div>
  );
}
