import { Link, useNavigate } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { MapIcon } from '@heroicons/react/24/outline';
import { useAppState } from '../../../hooks/appState';
import Icon from '../../../ui/icon/icon';

export default function SubHeader() {
  const navigate = useNavigate();

  const { organismState } = useAppState();
  const { organism } = organismState;
  const lastSearch = localStorage.getItem('last_search');
  const targetPath = lastSearch !== null ? lastSearch : '/';
  const services = organism?.services;
  const categoriesTagName = [
    ...new Set(
      services?.map((service) => {
        return {
          name: service.categorie_id.translations[0].name,
          tag: service.categorie_id.tag,
        };
      })
    ),
  ].sort();

  const categories = categoriesTagName.map((tag, index) => ({
    id: index + 1,
    value: tag.tag,
    name: tag.name,
  }));
  if (organism === null) {
    return <span>Erreur</span>;
  }

  return (
    <header className="relative pt-16 isolate">
      <div
        className="absolute inset-0 overflow-hidden -z-10"
        aria-hidden="true"
      >
        <div className="absolute -mt-16 opacity-50 left-16 top-full transform-gpu blur-3xl xl:left-1 2xl:-ml-80">
          <div
            className="aspect-[25004/1100] w-[130rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
            style={{
              clipPath:
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
      </div>
      <div className="px-4 py-10 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-x-8 lg:mx-0 lg:max-w-none">
          <div className="flex items-center gap-x-10">
            <button
              type="button"
              onClick={() => navigate(targetPath)}
              className="hidden gap-2 px-3 py-2 text-sm font-semibold text-gray-900 bg-transparent rounded-md shadow-sm lg:flex ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <span aria-hidden="true">&larr;</span>
              Retour
            </button>
            <h1 className="font-semibold leading-6 text-left ">
              <div className="mt-1 text-lg text-zinc-700/80">
                {organism?.name}
              </div>
              <div className="text-sm text-teal-700/80">
                {organism?.address}
              </div>
              <div className="flex mt-2 gap-x-3">
                {categories.map((categorie) => (
                  <div className="has-tooltip" key={categorie.id}>
                    <Icon
                      className="h-6 w-7 text-slate-500/80"
                      icon={categorie.value}
                    />
                    <span
                      id="tooltip-default"
                      role="tooltip"
                      className="absolute inline-block px-3 py-2 mt-8 -ml-10 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm bg-zinc-800/70 tooltip"
                    >
                      {categorie.name}
                    </span>
                  </div>
                ))}
              </div>
            </h1>
          </div>
          <div className="inline-flex items-center rounded-md shadow-s">
            <Link
              to={`https://www.google.com/maps/search/?api=1&query=${organism.latitude}%2C${organism.longitude}`}
              target="_blank"
              className="relative items-center hidden px-3 py-2 -ml-px text-sm font-semibold text-gray-900 bg-transparent sm:inline-flex rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 gap-x-2"
            >
              <MapIcon className="w-4 h-4 text-gray-700" aria-hidden="true" />
              Aller vers
            </Link>
            <Link
              to={`tel:${organism.phone}`}
              className="relative items-center hidden px-3 py-2 -ml-px text-sm font-semibold text-gray-900 bg-transparent sm:inline-flex rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 gap-x-2"
            >
              <PhoneIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
              {organism?.phone}
            </Link>

            {/* <Menu as="div" className="relative sm:hidden">
              <Menu.Button className="block p-3 -m-3">
                <span className="sr-only">More</span>
                <EllipsisVerticalIcon
                  className="w-6 h-6 text-zinc-800"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`tel:${organism.phone}`}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900 active:bg-gray-50'
                        )}
                      >
                        Appeler
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`https://www.google.com/maps/search/?api=1&query=${organism.latitude}%2C${organism.longitude}`}
                        target="_blank"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900 active:bg-gray-50'
                        )}
                      >
                        Aller vers
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu> */}
          </div>
        </div>
      </div>
    </header>
  );
}
