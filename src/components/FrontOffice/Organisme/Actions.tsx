import { Link } from 'react-router-dom';
import { MapIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAppState } from '../../../hooks/appState';

export default function Actions() {
  const { organismState } = useAppState();
  const { organism } = organismState;
  if (organism === null) {
    return <span>Erreur</span>;
  }
  return (
    <div className="inline-flex items-center justify-center w-full mb-2 rounded-md sm:hidden shadow-s">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${organism.latitude}%2C${organism.longitude}`}
        target="_blank"
        className="relative inline-flex items-center justify-center w-1/2 px-3 py-2 -ml-px text-sm font-semibold text-green-600 bg-transparent rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 gap-x-2"
      >
        <MapIcon className="w-4 h-4 text-green-600" aria-hidden="true" />
        Aller vers
      </Link>
      <Link
        to={`tel:${organism.phone}`}
        className="relative inline-flex items-center justify-center w-1/2 px-3 py-2 -ml-px text-sm font-semibold bg-transparent text-cyan-600 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 gap-x-2"
      >
        <PhoneIcon className="w-4 h-4 text-cyan-600" aria-hidden="true" />
        Appeler
      </Link>
    </div>
  );
}
