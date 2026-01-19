import { Link } from 'react-router-dom';
import {
  // MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/20/solid';

import logo from '../../../assets/logo-color.svg';

interface Props {
  setIsOpenSlide: React.Dispatch<React.SetStateAction<boolean>>;
}
// TODO Barre de recherche masquée (nécessite de passer les fonctions de la sidebar via le contexte) - A faire plus tard
export default function Header({ setIsOpenSlide }: Props) {
  return (
    <section>
      <div className="sticky top-0 z-40 flex items-center h-16 px-8 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-8 lg:px-10">
        <div className="flex self-stretch justify-between flex-1 ">
          <div className="flex items-center justify-start w-full gap-x-20 lg:w-1/2 md:w-7/12">
            <Link to="/" className="flex items-centershrink-0">
              <img className="w-auto h-10" src={logo} alt="watizat logo" />
            </Link>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsOpenSlide(true)}
                className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold rounded shadow-sm text-zinc-600 bg-zinc-100 hover:bg-zinc-200 gap-x-2"
              >
                <AdjustmentsHorizontalIcon
                  className="left-0 w-4 h-4 pointer-events-none text-slate-700/60 "
                  aria-hidden="true"
                />
                Filtrer les organismes affichés
              </button>
            </div>
          </div>

          {/* <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full h-full py-0 pl-8 pr-0 border-0 text-slate-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Rechercher un organisme..."
              type="search"
              name="search"
            />
          </form> */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Separator */}
            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              aria-hidden="true"
            />

            {/* Link to sign-in page */}
            <div className="flex justify-end flex-1">
              <Link
                to="/login"
                className="hidden text-sm font-semibold leading-6 text-gray-900 md:flex"
              >
                Membres Watizat&nbsp;&nbsp;
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
