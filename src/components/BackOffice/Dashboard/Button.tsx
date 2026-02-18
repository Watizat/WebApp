import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMe } from '../../../api/user';
import { DirectusUser } from '../../../@types/user';
import { useAppState } from '../../../hooks/appState';

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
  const { themeMode } = useAppState();
  const isDark = themeMode === 'dark';

  useEffect(() => {
    async function getUserInfos() {
      try {
        const meData = await fetchMe();
        setMe(meData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur : ",
          error
        );
        setMe(null);
      }
    }
    getUserInfos();
  }, []);

  const isRestricted =
    item.active === false ||
    ((item.refLocalOnly || item.devOnly) &&
      me?.role !== '4a30876c-cea0-455f-92d0-593212918aaf' &&
      me?.role !== '53de6ec2-6d70-48c8-8532-61f96133f139');

  return (
    <div>
      <Link
        key={item.name}
        to={item.href}
        className={`flex flex-col items-center justify-center m-auto text-center divide-y shadow h-52 rounded-xl aspect-square select-none ${
          isDark ? 'divide-gray-600 bg-gray-700/70' : 'divide-gray-200 bg-white/40'
        } ${isRestricted ? 'pointer-events-none' : 'hover:shadow-md hover:shadow-watizat-200 group'} ${
          isDark ? 'hover:bg-gray-700/90' : 'hover:bg-white/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center p-8">
          <div
            className={`flex items-center justify-center w-20 h-auto p-5 overflow-hidden rounded-full aspect-square ${
              isRestricted
                ? isDark
                  ? 'text-gray-500'
                  : 'text-gray-300'
                : isDark
                  ? 'text-indigo-200 group-hover:text-watizat-300'
                  : 'text-indigo-900/70 group-hover:text-watizat-400'
            }`}
          >
            <item.icon className="flex-shrink-0 mx-auto " />
          </div>
          <h3
            className={`mt-6 text-sm font-semibold  ${
              isRestricted
                ? isDark
                  ? 'text-gray-500'
                  : 'text-gray-300'
                : isDark
                  ? 'text-indigo-100 group-hover:text-watizat-300'
                  : 'text-indigo-900/70 group-hover:text-watizat-400'
            }`}
          >
            {item.name}
          </h3>
          <dl className="flex flex-col justify-between flex-grow mt-1">
            <dt className="sr-only">Description</dt>
            <dd
              className={`text-sm ${
                isRestricted
                  ? isDark
                    ? 'text-gray-500'
                    : 'text-gray-300'
                  : isDark
                    ? 'text-gray-200'
                    : 'text-slate-500'
              }`}
            >
              {item.descript}
            </dd>
          </dl>
        </div>
      </Link>
    </div>
  );
}
