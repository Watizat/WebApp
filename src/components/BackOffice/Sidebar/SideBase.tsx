import { useMemo, useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  PencilSquareIcon,
  LanguageIcon,
  PrinterIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CircleStackIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

import { useAppState } from '../../../hooks/appState';
import { clearMeCache, logout as logoutRequest } from '../../../api/user';
import { clearZonesCache } from '../../../api/admin';
import { removeUserDataFromLocalStorage } from '../../../utils/user';

import Tablet from './SideTablet';
import Desktop from './SideDesktop';
import Widescreen from './SideWidescreen';
import AppVersions from '../../Modals/AppVersions';

const BACKEND_URL = import.meta.env.VITE_API_URL;

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
  const [isOpenModalVersions, setIsOpenModalVersions] = useState(false);
  const { userState, resetAppState } = useAppState();
  const { roleName } = userState;

  const memoizedNavigation = useMemo(() => {
    return [
      {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: HomeIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: false,
      },
      {
        name: 'Edition',
        href: '/admin/edition',
        icon: PencilSquareIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: false,
      },
      {
        name: 'Traduction',
        href: '/admin/translate',
        icon: LanguageIcon,
        active: false,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: false,
      },
      {
        name: 'Print',
        href: '/admin/print',
        icon: PrinterIcon,
        active: false,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: false,
      },
      {
        name: 'Actualisation',
        href: '/admin/actualisation',
        icon: ArrowPathIcon,
        active: false,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: false,
      },
      {
        name: 'Utilisateur·ice·s',
        href: '/admin/users',
        icon: UsersIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
        devOnly: false,
        refLocalOnly: true,
      },
      {
        name: 'Back-end',
        href: BACKEND_URL,
        target: '_blank',
        icon: CircleStackIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
        devOnly: true,
        refLocalOnly: false,
      },
    ];
  }, [setSidebarOpen]);

  const allowedNav = useMemo(() => {
    const role = roleName || '';
    const roleToItems: Record<string, string[]> = {
      Administrator: ['Dashboard', 'Edition', 'Traduction', 'Print', 'Actualisation', 'Utilisateur·ice·s', 'Back-end'],
      RefLocal: ['Dashboard', 'Edition', 'Traduction', 'Print', 'Actualisation', 'Utilisateur·ice·s'],
      Edition: ['Dashboard', 'Edition', 'Traduction', 'Print', 'Actualisation'],
    };

    return new Set(roleToItems[role] || []);
  }, [roleName]);

  const memoizedActions = useMemo(() => {
    const handleLogout = () => {
      clearMeCache();
      clearZonesCache();
      logoutRequest().finally(() => {
        removeUserDataFromLocalStorage();
        localStorage.removeItem('city');
        resetAppState();
      });
    };

    return [
      {
        name: 'Versions',
        href: '#',
        icon: CommandLineIcon,
        active: true,
        onclick: () => setIsOpenModalVersions(true),
      },
      {
        name: 'Mon profil',
        href: '/admin/profil',
        icon: UserCircleIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
      },
      {
        name: 'Déconnexion',
        href: '/',
        icon: ArrowRightOnRectangleIcon,
        active: true,
        onclick: handleLogout,
      },
    ];
  }, [setSidebarOpen, resetAppState]);

  const filteredNavigation = memoizedNavigation.filter(item => allowedNav.has(item.name));

  return (
    <>
      <AppVersions isOpenModal={isOpenModalVersions} setIsOpenModal={setIsOpenModalVersions} />
      <Tablet
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={filteredNavigation}
        actions={memoizedActions}
      />
      <Desktop navigation={filteredNavigation} actions={memoizedActions} />
      <Widescreen navigation={filteredNavigation} actions={memoizedActions} />
    </>
  );
}
