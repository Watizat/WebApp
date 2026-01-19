import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useAppState } from '../../../../hooks/appState';
import Icon from '../../../../ui/icon/icon';

import './Map.css';

interface MapProps {
  cityPosition:
    | {
        lat: number;
        lng: number;
      }
    | undefined;
}

export default function Map({ cityPosition }: MapProps) {
  const [position] = useState({ lat: 43.6, lng: 1.433333 });
  const [navigatorGps, setNavigatorGps] = useState(false);
  const { organismState, setOrganismState } = useAppState();
  const { filteredOrganisms: organisms, userPosition } = organismState;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newUserPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOrganismState((prev) => ({ ...prev, userPosition: newUserPos }));
        setNavigatorGps(true);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    );
  }, [setOrganismState]);
  const me = new L.DivIcon({
    className: 'custom-me',
    html: `<div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  if (!cityPosition) {
    return <div />;
  }

  return (
    <MapContainer center={cityPosition || position} zoom={13}>
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      {/* <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      /> */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />

      {navigatorGps && <Marker position={userPosition} icon={me} />}

      {organisms.map((organism, index) => {
        if (organism.latitude !== null && organism.longitude !== null) {
          const customIcon = new L.DivIcon({
            className: 'custom-icon',
            html: `<div>${index + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -28],
          });
          return (
            <Marker
              key={organism.id}
              position={[organism.latitude, organism.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setOrganismState((prev) => ({
                    ...prev,
                    scroll: organism.id,
                  }));
                },
              }}
            >
              <Popup className="popup">
                <Link className="popup-text" to={`/organisme/${organism.slug}`}>
                  {organism.name}
                </Link>
                <Link
                  to={`https://www.google.com/maps/search/?api=1&query=${organism.latitude}%2C${organism.longitude}`}
                  target="_blank"
                  className="popup-button"
                >
                  <Icon
                    className="popup-button__icon"
                    icon="directions_walk"
                    size="1.2rem"
                  />
                  <p className="popup-button__text">J&apos;y vais !</p>
                </Link>
              </Popup>
            </Marker>
          );
        }
        // Return null if latitude or longitude is null
        return null;
      })}
    </MapContainer>
  );
}
