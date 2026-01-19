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
import { logout as logoutRequest } from '../../../api/user';
import { removeUserDataFromLocalStorage } from '../../../utils/user';

import Tablet from './SideTablet';
import Desktop from './SideDesktop';
import Widescreen from './SideWidescreen';
import AppVersions from '../../Modals/AppVersions';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
  const [isOpenModalVersions, setIsOpenModalVersions] = useState(false);
  const { setUserState } = useAppState();

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
        href: 'https://api.watizat.app',
        target: '_blank',
        icon: CircleStackIcon,
        active: true,
        onclick: () => setSidebarOpen(false),
        devOnly: true,
        refLocalOnly: false,
      },
    ];
  }, [setSidebarOpen]);

  const memoizedActions = useMemo(() => {
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
  }, [setSidebarOpen, setUserState]);

  return (
    <>
      <AppVersions
        isOpenModal={isOpenModalVersions}
        setIsOpenModal={setIsOpenModalVersions}
      />
      <Tablet
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={memoizedNavigation}
        actions={memoizedActions}
      />
      <Desktop navigation={memoizedNavigation} actions={memoizedActions} />
      <Widescreen navigation={memoizedNavigation} actions={memoizedActions} />
    </>
  );
}
