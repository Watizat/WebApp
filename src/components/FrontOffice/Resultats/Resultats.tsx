import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppState } from '../../../hooks/appState';
import { fetchCityPosition, fetchOrganisms } from '../../../api/organisms';

import Sidebar from './Sidebar';
import Header from '../Header/Results';
import Map from './Map/Map';
import MobileToggle from './MobileToggle';

export default function Resultats() {
  const { setOrganismState } = useAppState();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city');

  const [cityPosition, setCityPosition] = useState<
    | {
        lat: number;
        lng: number;
      }
    | undefined
  >();

  const [isMobileMap, setIsMobileMap] = useState(false);
  const [isOpenSlide, setIsOpenSlide] = useState(false);

  useEffect(() => {
    async function fetchCity() {
      const cityData = await fetchCityPosition(localStorage.getItem('city'));
      const { latitude, longitude } = cityData;
      setCityPosition({ lat: latitude, lng: longitude });
      setOrganismState((prev) => ({ ...prev, isLoading: true }));
      const organisms = await fetchOrganisms(city as string);
      setOrganismState((prev) => ({
        ...prev,
        organisms,
        filteredOrganisms: organisms,
        isLoading: false,
      }));
    }
    fetchCity();
  }, [setOrganismState, city]);

  return (
    <main>
      <Header setIsOpenSlide={setIsOpenSlide} />
      <Sidebar
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        isMobileMap={isMobileMap}
      />
      <section className="absolute inline-flex w-full min-h-mapHeight h-mapHeight py-auto lg:hidden">
        <Map cityPosition={cityPosition} />
      </section>
      <MobileToggle
        isMobileMap={isMobileMap}
        setIsMobileMap={setIsMobileMap}
      />
      <section className="absolute hidden w-full min-h-mapHeight h-mapHeight py-auto 2xl:pl-[45rem] xl:pl-[40rem] pl-[30rem] lg:flex">
        <Map cityPosition={cityPosition} />
      </section>
    </main>
  );
}
