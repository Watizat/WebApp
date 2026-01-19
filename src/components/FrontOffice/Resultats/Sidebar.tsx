import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { useAppState } from '../../../hooks/appState';
import SkeletonCard from '../../Skeleton/Resultats/Card';
import Card from './Card';

import SlideResultsFilters from '../SlideOvers/ResultsFilters/SlideResultsFilters';

interface SidebarProps {
  isOpenSlide: boolean;
  setIsOpenSlide: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMap: boolean;
}

export default function Sidebar({
  isOpenSlide,
  setIsOpenSlide,
  isMobileMap,
}: SidebarProps) {
  const isTouch = useMediaQuery({ query: '(max-width: 1023px)' });

  const { organismState, setOrganismState } = useAppState();
  const { organisms, filteredOrganisms, categoryFilter, scroll } =
    organismState;

  const [loader, setLoader] = useState<boolean>(true);

  const [isPmr, setIsPmr] = useState<boolean>(false);
  const [isAnimalsAccepted, setIsAnimalsAccepted] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const location = useLocation();

  localStorage.setItem('last_search', location.pathname + location.search);

  useEffect(() => {
    const setFilter = organisms.filter((organism) => {
      const matchesCategoryFilter =
        [
          ...new Set(
            organism.services.map((service) => service.categorie_id.tag)
          ),
        ].filter((tag) => categoryFilter.includes(tag)).length >=
        categoryFilter.length;

      const matchesPmrFilter = isPmr ? organism.pmr : true;
      const matchesAnimalsFilter = isAnimalsAccepted ? organism.animals : true;
      const matchesNameFilter = organism.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesNameFilterWithAccents = organism.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        matchesCategoryFilter &&
        matchesPmrFilter &&
        matchesAnimalsFilter &&
        (matchesNameFilter || matchesNameFilterWithAccents)
      );
    });
    setLoader(false); // Passer true pour tester les skeletons
    setOrganismState((prev) => ({ ...prev, filteredOrganisms: setFilter }));
  }, [
    organisms,
    categoryFilter,
    isPmr,
    isAnimalsAccepted,
    search,
    setOrganismState,
  ]);

  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scroll) {
      const element = document.getElementById(scroll.toString());
      if (element && resultsContainerRef.current) {
        const containerTop =
          resultsContainerRef.current.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollDistance = elementTop - containerTop - 25;

        resultsContainerRef.current.scrollTo({
          top: resultsContainerRef.current.scrollTop + scrollDistance,
          behavior: 'smooth',
        });
      }
    }
  }, [scroll]);

  return (
    <section
      className={
        isTouch && isMobileMap
          ? 'hidden '
          : 'w-full flex fixed inset-y-0 z-50 lg:w-[30rem] xl:w-[40rem] 2xl:w-[45rem] lg:flex-col mt-16'
      }
    >
      <div className="flex flex-col h-full overflow-y-auto bg-white border-r border-gray-200 grow">
        <div
          className="inline-flex flex-col min-h-full gap-6 p-4 overflow-y-auto pb-14 md:p-8 bg-zinc-100/30"
          ref={resultsContainerRef}
        >
          {loader &&
            Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i + 1} />)}
          {!loader &&
            (filteredOrganisms.length > 0 ? (
              filteredOrganisms.map((organism, index) => (
                <Card
                  key={organism.id}
                  organism={organism}
                  map_id={index + 1}
                  categoryFilter={categoryFilter}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full align-middle gap-y-4">
                <p className="font-semibold">Aucun résultat à afficher</p>
                <p className="text-center">
                  Réinitialisez les filtres ou retourner vers la page
                  d&apos;accueil
                </p>

                <Link to="/">
                  <button
                    type="button"
                    className="rounded-md bg-watizat-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-watizat-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-watizat-400"
                  >
                    <i className="las la-arrow-left" />
                    Retour
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>

      <SlideResultsFilters
        setIsPmr={setIsPmr}
        setIsAnimalsAccepted={setIsAnimalsAccepted}
        setSearch={setSearch}
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
      />
    </section>
  );
}
