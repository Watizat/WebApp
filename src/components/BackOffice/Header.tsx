import { ChangeEvent, useEffect, useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Listbox, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { clearMeCache, fetchMe, logout as logoutRequest } from '../../api/user';
import { useAppState } from '../../hooks/appState';
import { clearZonesCache, fetchZones } from '../../api/admin';
import { removeUserDataFromLocalStorage } from '../../utils/user';
import { DirectusUser } from '../../@types/user';
import { useAppContext } from '../../context/BackOfficeContext';
import ThemeToggle from '../shared/ThemeToggle';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
interface Props {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ setSidebarOpen }: Props) {
  const [select, setSelect] = useState(localStorage.getItem('city') || '');
  const { adminState, userState, setAdminState, setUserState, resetAppState, themeMode } = useAppState();
  const { isAdmin } = userState;
  const { zones } = adminState;
  const [me, setMe] = useState<DirectusUser | null>(null);
  const { pathname } = useLocation();
  const isDark = themeMode === 'dark';

  const handleChangeCity = (event: ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('city', event.target.value);
    setSelect(event.target.value);
    setUserState(prev => ({ ...prev, city: event.target.value }));
  };

  useEffect(() => {
    async function getUserInfos() {
      const meData = await fetchMe({ force: true });
      setMe(meData);
    }
    getUserInfos();
    const loadZones = async () => {
      const zonesList = await fetchZones();
      setAdminState(prev => ({ ...prev, zones: zonesList }));
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
    clearMeCache();
    clearZonesCache();
    logoutRequest().finally(() => {
      removeUserDataFromLocalStorage();
      localStorage.removeItem('city');
      resetAppState();
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
    <div
      className={`sticky top-0 z-40 flex items-center h-16 px-4 border-b shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <button
        type='button'
        className={`-m-2.5 p-2.5 lg:hidden ${isDark ? 'text-gray-100' : 'text-gray-700'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <span className='sr-only'>Ouvrir la sidebar</span>
        <Bars3Icon className='w-6 h-6' aria-hidden='true' />
      </button>

      {/* Separator */}
      <div className='w-px h-6 bg-gray-900/10 lg:hidden' aria-hidden='true' />

      <div className='flex items-center self-stretch justify-between flex-1 gap-x-4 lg:gap-x-6'>
        <div className='flex gap-10'>
          {/* Création organisme */}
          {pathname === '/admin/edition' && (
            <>
              <button
                type='button'
                onClick={() => setIsOpenSlideNewOrga(true)}
                className='px-2 py-1 text-xs font-semibold rounded shadow-sm text-sky-600 bg-sky-50 hover:bg-sky-100'
              >
                Créer un nouvel organisme
              </button>
              <button
                type='button'
                onClick={() => setIsDisplayArchivedOrga(!isDisplayArchivedOrga)}
                className='px-2 py-1 text-xs font-semibold rounded shadow-sm text-zinc-600 bg-zinc-100 hover:bg-zinc-200'
              >
                {isDisplayArchivedOrga ? 'Masquer les organismes archivés' : 'Afficher les organismes archivés'}
              </button>
            </>
          )}
        </div>
        <div className='flex items-center gap-x-4 lg:gap-x-6'>
          {/* City select */}
          <div className='w-56'>
            <Listbox
              value={select}
              onChange={value => {
                if (!isAdmin) {
                  return;
                }
                handleChangeCity({
                  target: { value },
                } as ChangeEvent<HTMLSelectElement>);
              }}
              disabled={!isAdmin}
            >
              <div className='relative'>
                <Listbox.Button
                  aria-disabled={!isAdmin}
                  className={`relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left ring-1 ring-inset sm:text-sm sm:leading-6 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gray-800 text-gray-100 ring-gray-700 disabled:bg-gray-800 disabled:text-gray-500'
                      : 'bg-white text-gray-900 ring-gray-200/80 disabled:bg-gray-50 disabled:text-gray-500'
                  }`}
                >
                  <span className='block truncate'>{select || 'Selectionner une ville'}</span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <ChevronDownIcon className='h-4 w-4 text-gray-400' aria-hidden='true' />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options
                    className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-sm shadow-lg ring-1 focus:outline-none ${
                      isDark ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-black/5'
                    }`}
                  >
                    <Listbox.Option
                      value=''
                      disabled
                      className='relative cursor-default select-none py-2 pl-3 pr-9 text-gray-400'
                    >
                      Selectionner une ville
                    </Listbox.Option>
                    {zones.map(zone => (
                      <Listbox.Option
                        key={zone.id}
                        value={zone.name}
                        className={({ active }) =>
                          classNames(
                            active
                              ? isDark
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-sky-50 text-sky-900'
                              : isDark
                                ? 'text-gray-100'
                                : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          )
                        }
                      >
                        {({ selected }) => (
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                            {zone.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          {/* Separator */}
          <ThemeToggle />
          <div
            className={`hidden lg:block lg:h-6 lg:w-px ${isDark ? 'lg:bg-gray-700' : 'lg:bg-gray-900/10'}`}
            aria-hidden='true'
          />
          {/* Profile dropdown */}
          <Menu as='div' className='relative'>
            <Menu.Button className='-m-1.5 flex items-center p-1.5'>
              <span className='sr-only'>Open user menu</span>
              <UserCircleIcon className={`w-8 h-8 ${isDark ? 'text-gray-200' : 'text-gray-400'}`} aria-hidden='true' />
              <span className='hidden lg:flex lg:items-center'>
                <span
                  className={`ml-4 text-sm font-semibold leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                  aria-hidden='true'
                >
                  {me.first_name || ''} {me.last_name || ''}
                </span>
                <ChevronDownIcon className='w-5 h-5 ml-2 text-gray-400' aria-hidden='true' />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                className={`absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 focus:outline-none ${
                  isDark ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-gray-900/5'
                }`}
              >
                {actions.map(action => (
                  <Menu.Item key={action.name}>
                    {({ active }) => (
                      <Link
                        to={action.href}
                        onClick={action.onclick}
                        className={classNames(
                          active ? (isDark ? 'bg-gray-700' : 'bg-gray-50') : '',
                          `block px-3 py-1 text-sm leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`,
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
