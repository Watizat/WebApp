import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMe } from '../../../api/user';
import { DirectusUser } from '../../../@types/user';

interface Props {
  item: {
    name: string;
    href?: string;
    icon: React.ElementType;
    active: boolean;
    onclick: () => void;
    refLocalOnly?: boolean;
    devOnly?: boolean;
  };
}

export default function LinkSquare({ item }: Props) {
  const { pathname } = useLocation();
  const [me, setMe] = useState<DirectusUser | null>(null);

  useEffect(() => {
    async function getUserInfos() {
      try {
        const meData = await fetchMe();
        setMe(meData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Erreur lors de la recuperation des donnees de l'utilisateur : ", error);
        setMe(null);
      }
    }
    getUserInfos();
  }, []);

  const roleName = typeof me?.role === 'string' ? me.role : me?.role?.name;
  const canAccessPrivilegedItems = roleName === 'RefLocal' || roleName === 'Administrator';
  const isDisabled = item.active === false || ((item.refLocalOnly || item.devOnly) && !canAccessPrivilegedItems);

  return (
    <li key={item.name}>
      <Link
        to={item.href || ''}
        onClick={item.onclick}
        className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold ${
          isDisabled
            ? ' text-watizat-100/40 pointer-events-none'
            : pathname === item.href
            ? ' text-white bg-watizat-400/70'
            : 'text-watizat-100 hover:text-white hover:bg-watizat-600'
        }`}
      >
        <item.icon
          className={`h-6 w-6 shrink-0 ${
            isDisabled
              ? ' text-watizat-100/40 pointer-events-none'
              : pathname === item.href
              ? ' text-white '
              : 'text-watizat-100 hover:text-white hover:bg-watizat-600'
          } `}
          aria-hidden='true'
        />
        <span className='sr-only'>{item.name}</span>
      </Link>
    </li>
  );
}
