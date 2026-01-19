import axios from 'axios';

const apiKey = '7d4f63fb-110c-4cc3-a5ee-aa4b382e0865';

const navitiaInstance = axios.create({
  baseURL: 'https://api.navitia.io/v1',
  headers: {
    Authorization: `${apiKey}`,
  },
});

export interface NavitiaBusLine {
  id: string;
  code: string;
  color: string;
  text_color: string;
  commercial_mode: {
    name: string;
  };
}

export interface NavitiaPlaceNearbyData {
  id: string;
  name: string;
  distance: string;
  lines: NavitiaBusLine[];
}

interface NavitiaPlaceNearbyResponse {
  places_nearby: NavitiaPlaceNearbyData[];
}

interface NavitiaLinesResponse {
  lines: NavitiaBusLine[];
}

export const fetchPlacesNearby = async (
  longitude: number,
  latitude: number
): Promise<NavitiaPlaceNearbyData[]> => {
  const endpoint = `/coverage/fr-sw/coord/${longitude}%3B${latitude}/places_nearby?distance=500&type[]=stop_area&`;
  const { data } = await navitiaInstance.get<NavitiaPlaceNearbyResponse>(
    endpoint
  );

  return data.places_nearby.map((place) => {
    return {
      id: place.id,
      name: place.name,
      distance: place.distance,
      lines: [],
    };
  });
};

export const fetchBusLinesForStops = async (
  stops: NavitiaPlaceNearbyData[]
): Promise<NavitiaPlaceNearbyData[]> => {
  if (stops.length === 0) {
    return [];
  }

  const busLinesPromises = stops.map(async (stop) => {
    const { id, ...rest } = stop;
    const endpoint = `coverage/fr-sw/stop_areas/${id}/lines`;
    const { data } = await navitiaInstance.get<NavitiaLinesResponse>(endpoint);
    const busLine = data.lines.map((line) => {
      return {
        id: line.id,
        code: line.code,
        color: line.color,
        text_color: line.text_color,
        commercial_mode: {
          name: line.commercial_mode.name,
        },
      };
    });

    return {
      id,
      ...rest,
      lines: busLine,
    };
  });

  return Promise.all(busLinesPromises);
};
