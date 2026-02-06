import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMe } from '../../../api/user';
import { DirectusUser } from '../../../@types/user';

interface Props {
  item: {
    name: string;
    descript: string;
    href: string;
    active: boolean;
    icon: React.ElementType;
    refLocalOnly: boolean;
    devOnly: boolean;
  };
}

export default function Button({ item }: Props) {
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
    <div>
      <Link
        key={item.name}
        to={item.href}
        className={`flex flex-col items-center justify-center m-auto text-center divide-y divide-gray-200 shadow h-52 bg-white/40 rounded-xl aspect-square select-none  ${
          isDisabled
            ? 'pointer-events-none'
            : 'hover:shadow-md hover:shadow-watizat-200 group hover:bg-white/60'
        }`}
      >
        <div className='flex flex-col items-center justify-center p-8'>
          <div
            className={`flex items-center justify-center w-20 h-auto p-5 overflow-hidden rounded-full aspect-square ${
              isDisabled ? 'text-gray-300' : ' text-indigo-900/70 ring-watizat-200 group-hover:text-watizat-400 '
            }`}
          >
            <item.icon className='flex-shrink-0 mx-auto ' />
          </div>
          <h3
            className={`mt-6 text-sm font-semibold  ${
              isDisabled ? 'text-gray-300' : ' text-indigo-900/70 group-hover:text-watizat-400'
            }`}
          >
            {item.name}
          </h3>
          <dl className='flex flex-col justify-between flex-grow mt-1'>
            <dt className='sr-only'>Description</dt>
            <dd className={`text-sm ${isDisabled ? 'text-gray-300' : ' text-slate-500 '}`}>{item.descript}</dd>
          </dl>
        </div>
      </Link>
    </div>
  );
}
