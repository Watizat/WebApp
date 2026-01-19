import { ChangeEvent, useEffect, useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { fetchMe } from '../../api/user';
import { useAppState } from '../../hooks/appState';
import { fetchZones } from '../../api/admin';
import { logout as logoutRequest } from '../../api/user';
import { removeUserDataFromLocalStorage } from '../../utils/user';
import { DirectusUser } from '../../@types/user';
import { useAppContext } from '../../context/BackOfficeContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
interface Props {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ setSidebarOpen }: Props) {
  const [select, setSelect] = useState(localStorage.getItem('city') || '');
  const { adminState, userState, setAdminState, setUserState } = useAppState();
  const { isAdmin } = userState;
  const { zones } = adminState;
  const [me, setMe] = useState<DirectusUser | null>(null);
  const { pathname } = useLocation();

  const handleChangeCity = (event: ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('city', event.target.value);
    setSelect(event.target.value);
    setUserState((prev) => ({ ...prev, city: event.target.value }));
  };

  useEffect(() => {
    async function getUserInfos() {
      const meData = await fetchMe();
      setMe(meData);
    }
    getUserInfos();
    const loadZones = async () => {
      const zonesList = await fetchZones();
      setAdminState((prev) => ({ ...prev, zones: zonesList }));
    };
    loadZones();
  }, [setAdminState]);

  useEffect(() => {
    const loadZones = async () => {
      const zonesList = await fetchZones();
      setAdminState((prev) => ({ ...prev, zones: zonesList }));
    };
    loadZones();
  }, [setAdminState]);

  // Récupération du contexte
  const appContext = useAppContext();
  if (!appContext) {
    return <div />; // Gérer le cas où le contexte n'est pas défini
  }
  const { setIsOpenSlideNewOrga } = appContext;
  const { isDisplayArchivedOrga, setIsDisplayArchivedOrga } = appContext;

  const handleLogout = () => {
    logoutRequest().finally(() => {
      removeUserDataFromLocalStorage();
      setUserState((prev) => ({
        ...prev,
        isLogged: false,
        isActive: false,
        lastActionDate: null,
        token: null,
      }));
    });
  };

  const actions = [
    {
      name: 'Mon profil',
      href: '/admin/profil',
      onclick: () => {}, // Fonction vide pour éviter le warning
    },
    {
      name: 'Déconnexion',
      href: '/',
      onclick: handleLogout,
    },
  ];

  if (!me) {
    return <div />;
  }

  return (
    <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Ouvrir la sidebar</span>
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex items-center self-stretch justify-between flex-1 gap-x-4 lg:gap-x-6">
        <div className="flex gap-10">
          {/* Création organisme */}
          {pathname === '/admin/edition' && (
            <>
              <button
                type="button"
                onClick={() => setIsOpenSlideNewOrga(true)}
                className="px-2 py-1 text-xs font-semibold rounded shadow-sm text-sky-600 bg-sky-50 hover:bg-sky-100"
              >
                Créer un nouvel organisme
              </button>
              <button
                type="button"
                onClick={() => setIsDisplayArchivedOrga(!isDisplayArchivedOrga)}
                className="px-2 py-1 text-xs font-semibold rounded shadow-sm text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
              >
                {isDisplayArchivedOrga
                  ? 'Masquer les organismes archivés'
                  : 'Afficher les organismes archivés'}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* City select */}
          <div>
            <select
              value={select}
              onChange={handleChangeCity}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-200/80 sm:text-sm sm:leading-6 bg-white  hover:bg-white disabled:cursor-not-allowed"
              disabled={!isAdmin}
            >
              <option value="" disabled>
                Selectionner une ville
              </option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.name}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />
          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full bg-gray-50"
                src="https://source.boringavatars.com/beam?colors=ff8482,ffb294,f8d8a5,91be95,635a49"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  aria-hidden="true"
                >
                  {me.first_name || ''} {me.last_name || ''}
                </span>
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 -z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                {actions.map((action) => (
                  <Menu.Item key={action.name}>
                    {({ active }) => (
                      <Link
                        to={action.href}
                        onClick={action.onclick}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        {action.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
