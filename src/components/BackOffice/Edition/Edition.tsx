import { useEffect } from 'react';
import { useAppState } from '../../../hooks/appState';
import { fetchAdminOrganisms } from '../../../api/admin';
import NewOrganism from '../SlideOvers/Edition/NewOrganism';
import Sidelist from './SideList';
import DataPanel from './DataPanel/DataPanel';
import { useAppContext } from '../../../context/BackOfficeContext';

export default function Edition() {
  const { setAdminState, userState, themeMode } = useAppState();
  const city = userState.city as string;
  const isDark = themeMode === 'dark';

  useEffect(() => {
    const loadOrganisms = async () => {
      setAdminState((prev) => ({ ...prev, isLoading: true }));
      const organisms = await fetchAdminOrganisms({ city });
      setAdminState((prev) => ({ ...prev, organisms, isLoading: false }));
    };
    loadOrganisms();
  }, [setAdminState, city]);

  // Récupération du contexte
  const appContext = useAppContext();
  if (!appContext) {
    return <div />; // Gérer le cas où le contexte n'est pas défini
  }
  const { isOpenSlideNewOrga, setIsOpenSlideNewOrga } = appContext; // On récupère les valeurs du contexte

  return (
    <main
      className={`flex flex-1 h-full min-w-full min-h-full align-middle ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-gray-700'
      }`}
    >
      <NewOrganism
        isOpenSlide={isOpenSlideNewOrga}
        setIsOpenSlide={setIsOpenSlideNewOrga}
      />
      <Sidelist />
      <DataPanel />
    </main>
  );
}
