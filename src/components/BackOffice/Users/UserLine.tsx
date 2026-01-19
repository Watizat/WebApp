import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Importez le fichier de localisation français
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useState } from 'react';
import { DirectusUser } from '../../../@types/user';
import SlideEditUser from '../SlideOvers/Users/EditUser';
// import ModalUsers from '../../Modals/ModalEditUsers';
import { useAppState } from '../../../hooks/appState';

interface Props {
  user: DirectusUser;
}
dayjs.locale('fr');
dayjs.extend(localizedFormat); // Activer le plugin localizedFormat

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
  const uniqueQueryParam = Math.random();
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
            <div className="flex-shrink-0 w-9 h-9">
              <img
                className="rounded-full w-9 h-9"
                src={`https://source.boringavatars.com/beam?${uniqueQueryParam}`}
                alt=""
              />
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
            dayjs(user.last_access).isBefore(dayjs().subtract(6, 'months')) // Si date de connexion supérieure à 6 mois
              ? ' text-red-500' // Date en rouge rouge
              : ' text-gray-500'
          } whitespace-nowrap`}
        >
          {dayjs(user.last_access).format('DD MMMM YYYY') !== 'Invalid Date'
            ? dayjs(user.last_access).format('DD MMMM YYYY')
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
