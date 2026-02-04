import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Organism } from '../../../@types/organism';
import { useAppState } from '../../../hooks/appState';
import {
  fetchBusLinesForStops,
  fetchPlacesNearby,
  NavitiaBusLine,
  NavitiaPlaceNearbyData,
} from '../../../api/navitia';

import icon from '../../../assets/public-transports.svg';

interface TransportData {
  id: string;
  name: string;
  distance: string;
  lines: BusLine[];
}

type PlaceNearbyData = NavitiaPlaceNearbyData;
type BusLine = NavitiaBusLine;

export default function Transports() {
  const [data, setData] = useState<TransportData[]>([]);
  const { organismState } = useAppState();
  const organism = organismState.organism as Organism;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const placeNearbyTransport = await fetchPlacesNearby(
          organism.longitude,
          organism.latitude
        );
        const dataWithBusLines = await fetchBusLinesForStops(
          placeNearbyTransport
        );
        setData(dataWithBusLines);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Erreur lors de l'appel API placeNearby:", error);
        setData([]);
      }
    };

    fetchData();
  }, [organism]);

  // si l'organism n'existe pas
  if (data.length === 0) {
    return (
      <article>
        <h3>Accès en transports</h3>
        <span>Pas de données de transports</span>
      </article>
    );
  }

  const convertColorToRGB = (color: string): string => {
    // Convert hex color to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="flex flex-col overflow-hidden border border-gray-200 xl:gap-x-8 rounded-xl ">
      <div className="flex items-center px-6 py-4 border-b gap-x-4 border-gray-900/5 bg-gray-50">
        <img
          src={icon}
          alt="bus public"
          className="flex-none object-cover w-8 h-8 "
        />
        <div className="text-sm font-medium leading-6 text-gray-900">
          Accès en transports public
        </div>
      </div>
      <div className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between pt-1 pb-2 text-gray-500 gap-x-4"
          >
            <p className="w-full">
              <span className="text-black">{item.name}</span> à {item.distance}{' '}
              m
            </p>
            <p className="flex flex-wrap w-full gap-x-1 gap-y-1">
              {item.lines.map((line) => (
                <React.Fragment key={line.id}>
                  <span
                    className="font-semibold flex flex-nowrap justify-center items-center pt-0.5 pb-0.5 px-1.5 rounded
"
                    style={{
                      backgroundColor: `rgba(${convertColorToRGB(
                        line.color
                      )}, 0.7)`,
                      color: `rgba(${convertColorToRGB(line.text_color)}, 0.9)`,
                    }}
                  >
                    <i
                      className={
                        line.commercial_mode.name === 'Bus'
                          ? classNames('las la-bus-alt')
                          : classNames('las la-subway')
                      }
                    />
                    <span className="text-sm">{line.code}</span>
                  </span>
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
