import { useEffect, useState } from 'react';
import { Organism } from '../../../@types/organism';
import { useAppState } from '../../../hooks/appState';
import {
  fetchAdminOrganisms,
  fetchAdminOrganism,
} from '../../../api/admin';
import { useAppContext } from '../../../context/BackOfficeContext';

export default function SideList() {
  const { adminState, userState, setAdminState } = useAppState();
  const { organisms, isLoading } = adminState;
  const [isActive, setIsActive] = useState<number | null>(null);
  const city = userState.city as string;

  function handleClick(organism: Organism) {
    fetchAdminOrganism(organism.id).then((organismData) => {
      setAdminState((prev) => ({ ...prev, organism: organismData }));
    });
    setIsActive(organism.id);
  }

  // Récupération du contexte
  const appContext = useAppContext();
  useEffect(() => {
    const fetchOrganisms = async () => {
      setAdminState((prev) => ({ ...prev, isLoading: true }));
      const organisms = await fetchAdminOrganisms({
        city,
        isDisplayArchivedOrga: appContext?.isDisplayArchivedOrga,
      });
      setAdminState((prev) => ({ ...prev, organisms, isLoading: false }));
    };

    fetchOrganisms();
  }, [setAdminState, city, appContext?.isDisplayArchivedOrga]);

  const filteredOrganisms = appContext?.isDisplayArchivedOrga
    ? organisms
    : organisms.filter((org) => org.visible);

  return (
    <aside className="sticky flex flex-col w-4/12 h-[calc(100vh-4rem)] max-h-screen overflow-y-auto bg-white shadow top-16 2xl:w-3/12">
      <ul className=" p-0 divide-y divide-gray-200 h-full;">
        {isLoading && <span />}
        {filteredOrganisms.map((organism) => (
          <li key={organism.id}>
            <button
              type="button"
              onClick={() => handleClick(organism)}
              className={` w-full text-left px-4 py-2 hover:bg-slate-200/50 min-h-[4rem] 
              ${
                isActive === organism.id &&
                'shadow-inner bg-slate-100/50 font-semibold'
              }`}
            >
              <div className="flex w-full flex-nowrap">
                <div className="flex flex-col flex-1">
                  <div
                    className={`text-sm lowercase first-letter:capitalize font-medium 
              ${
                isActive === organism.id ? ' text-teal-900 ' : 'text-gray-900'
              }`}
                  >
                    {organism.name}
                  </div>
                  <div className="flex items-center justify-between flex-1 ">
                    <div
                      className={`text-xs font-medium ${
                        isActive === organism.id
                          ? ' text-gray-500 '
                          : 'text-gray-400'
                      }`}
                    >
                      {organism.address}
                    </div>
                  </div>
                </div>
                <div>
                  {!organism.visible && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 rounded-md bg-red-50 ring-1 ring-inset ring-red-600/10">
                      Archivé
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
