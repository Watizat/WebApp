import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Footer from '../FrontOffice/Footer/Footer';
import Header from '../FrontOffice/Header/Default';

import { useAppState } from '../../hooks/appState';
import { fetchZones } from '../../api/admin';
import { fetchCategories, fetchDays } from '../../api/organisms';

export default function FrontApp() {
  const isTablet = useMediaQuery({ query: '(min-width: 769px)' });
  const { organismState, setAdminState, setOrganismState } = useAppState();
  const [loading, setLoading] = useState(true);
  const { langue } = organismState;

  useEffect(() => {
    const fetchData = async () => {
      setOrganismState((prev) => ({ ...prev, isLoading: true }));
      const categories = await fetchCategories();
      setOrganismState((prev) => ({
        ...prev,
        categories,
        isLoading: false,
      }));
      setLoading(false);
    };
    fetchData();
  }, [setOrganismState]);

  useEffect(() => {
    const loadZones = async () => {
      const zones = await fetchZones();
      setAdminState((prev) => ({ ...prev, zones }));
    };
    loadZones();
  }, [setAdminState]);

  useEffect(() => {
    const loadDays = async () => {
      const days = await fetchDays(1);
      setOrganismState((prev) => ({ ...prev, days }));
    };
    loadDays();
  }, [setOrganismState, langue]);

  return (
    <main className="relative flex flex-col min-h-full overflow-y-hidden md:overflow-auto">
      {!loading && (
        <>
          <Header />
          <Outlet />
          {isTablet && <Footer />}
        </>
      )}
    </main>
  );
}
