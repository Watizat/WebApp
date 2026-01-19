import { useState } from 'react';
import { useAppState } from '../../../../hooks/appState';
import Card from './components/Card';
import ServiceCard from './components/ServiceCard';
import NewService from '../../SlideOvers/Edition/NewService';

export default function Services() {
  const [isOpenSlide, setIsOpenSlide] = useState(false);
  const { adminState } = useAppState();
  const { organism } = adminState;
  const services = organism?.services;

  const menuChoices = [
    {
      title: 'Ajouter un service',
      onClick: () => {
        setIsOpenSlide(true);
      },
    },
  ];

  return (
    <>
      {/* Slide d'ajout d'un contact */}
      <NewService isOpenSlide={isOpenSlide} setIsOpenSlide={setIsOpenSlide} />

      {/*  Modal de suppression du contact */}
      <Card
        title="Services"
        srMessage="Services de l'organisme"
        menuChoices={menuChoices}
      >
        <ul className="grid grid-cols-1 gap-6 p-4 sm:columns-2 lg:grid-cols-2 2xl:grid-cols-3 ">
          {services && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))
          ) : (
            <span className="ml-1 text-sm ">Pas de services à afficher</span>
          )}
        </ul>
      </Card>
    </>
  );
}
