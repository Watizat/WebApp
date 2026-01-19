import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// import { PhoneIcon } from '@heroicons/react/24/solid';
import { useAppState } from '../../../hooks/appState';
import { fetchOrganism } from '../../../api/organisms';

import SubHeader from './SubHeader';
import Transports from './Transports';
import Map from './Map';
import Informations from './Informations';
import Contacts from './Contacts';
import Container from '../../Container/Container';
import Services from './Services';
import Header from '../Header/Organisms';
import Actions from './Actions';

export default function Organisme() {
  const { slug } = useParams();
  const { organismState, setOrganismState } = useAppState();
  const { organism } = organismState;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setOrganismState((prev) => ({ ...prev, isLoading: true }));
      const organismData = await fetchOrganism(slug as string);
      setOrganismState((prev) => ({
        ...prev,
        organism: organismData,
        isLoading: false,
      }));
      setLoading(false);
    };
    fetchData();
  }, [setOrganismState, slug]);

  /*   const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get('city') || '';
  const category = (searchParams.get('category') || '').split(','); */

  if (organism === null && !loading) {
    return (
      <>
        <Header />
        <main>
          <Container>
            <span>Cet organisme n&apos;éxiste pas</span>
          </Container>
        </main>
      </>
    );
  }
  if (organism === null) {
    return <span>Erreur</span>;
  }

  return (
    <>
      <Header />
      <main>
        <SubHeader />
        <div className="px-4 py-4 mx-auto lg:py-16 max-w-screen-2xl sm:px-6 lg:px-8">
          <div className="grid items-start max-w-2xl grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col gap-2 lg:gap-y-6 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-18">
              <Actions />
              <Informations />
              <Services />
            </div>
            <div className="flex flex-col gap-2 lg:gap-y-6">
              <Map />
              <Contacts />
              <Transports />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
