import moment from 'moment';
import 'moment/locale/fr';
import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { DirectusUser } from '../../../@types/user';
import SlideEditUser from '../SlideOvers/Users/EditUser';
import { useAppState } from '../../../hooks/appState';

interface Props {
  user: DirectusUser;
}
moment.locale('fr');

function renderRoles(data: DirectusUser) {
  if (data.status === 'active') {
    if (data.role === '53de6ec2-6d70-48c8-8532-61f96133f139') {
      return {
        className: 'bg-purple-50 text-purple-700  ring-purple-700/10',
        text: 'admin',
      };
    }
    if (data.role === '4a30876c-cea0-455f-92d0-593212918aaf') {
      return {
        className: 'bg-green-50 text-green-700 ring-green-600/20',
        text: 'ref-local',
      };
    }
    if (data.role === '5754603f-add3-4823-9c77-a2f9789074fc') {
      return {
        className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
        text: 'Nouveau·elle - A valider',
      };
    }
    return {
      className: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      text: 'edition',
    };
  }
  if (data.status === 'suspended') {
    return {
      className: 'bg-red-50 text-red-700 ring-red-600/10',
      text: 'Désactivé - A supprimer',
    };
  }

  // Gérer les autres cas ici, par exemple :
  return {
    className: 'bg-gray-50 text-gray-700 ring-gray-500/10',
    text: 'Statut inconnu',
  };
}

export default function UserLine({ user }: Props) {
  const [isOpenSlide, setIsOpenSlide] = useState(false);
  const { adminState } = useAppState();
  const { zones } = adminState;
  const { className, text } = renderRoles(user);

  return (
    <>
      <SlideEditUser
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        user={user}
      />
      <tr key={user.email} className="select-none">
        <td className="py-2 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-0">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-9 h-9 text-gray-400">
              <UserCircleIcon className="w-9 h-9" aria-hidden="true" />
            </div>
            <div className="ml-4 font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </td>
        <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-mediu  ring-1 ring-inset  ${className}`}
          >
            {text}
          </span>
        </td>
        <td className="px-3 py-5 text-sm text-center text-gray-500 whitespace-nowrap">
          <div className="text-gray-900">
            {zones.find((zone) => zone.id === user.zone)?.name}
          </div>
        </td>
        <td
          className={`px-3 py-5 text-sm text-center ${
            moment(user.last_access).isBefore(moment().subtract(6, 'months')) // Si date de connexion supérieure à 6 mois
              ? ' text-red-500' // Date en rouge rouge
              : ' text-gray-500'
          } whitespace-nowrap`}
        >
          {moment(user.last_access).isValid()
            ? moment(user.last_access).format('DD MMMM YYYY')
            : 'Jamais connecté'}
        </td>
        <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
          {user.email}
        </td>
        <td className="relative py-5 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
          <button
            type="button"
            onClick={() => setIsOpenSlide(true)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        </td>
      </tr>
    </>
  );
}
