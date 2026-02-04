import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useAppState } from '../../../hooks/appState';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Contact() {
  const { organismState } = useAppState();
  const { organism } = organismState;

  if (organism === null) {
    return <span>Erreur</span>;
  }

  const handleEmailClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Empêche la redirection par défaut
    window.location.href = `mailto:${organism.mail}`; // Ouvre le client de messagerie
  };

  return (
    organism.contacts.some((contact) => contact.visibility === true) && (
      <div>
        <h3 className="mb-3 ml-1 text-sm font-semibold text-slate-600/80">
          Contacts
        </h3>
        <ul className="flex flex-col gap-y-2">
          {organism.contacts
            .filter((contact) => contact.visibility === true)
            .map((contact) => (
              <li
                className="flex flex-col justify-start flex-1 pt-2 pb-3 pl-4 pr-1 bg-white rounded-lg shadow-sm cursor-pointer ring-slate-200 border-gray-50 ring-1 hover:ring-1 hover:ring-zinc-300/80 hover:bg-zinc-50/30"
                key={contact.name}
              >
                <div className="flex items-center justify-between">
                  <span className="w-11/12 text-sm text-zinc-900">
                    {contact.name}
                  </span>
                  <Menu as="div" className="relative ">
                    <Menu.Button className="block p-3 -m-3">
                      <span className="sr-only">More</span>
                      <EllipsisVerticalIcon
                        className="w-3 h-3 text-gray-500"
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
                        {contact.phone && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={`tel:${contact.phone}`}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block w-full px-3 py-1 text-left text-xs leading-6 text-gray-900'
                                )}
                              >
                                Appeler
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        {contact.mail && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={`mailto:${contact.mail.toLowerCase()}`}
                                onClick={handleEmailClick}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-xs leading-6 text-gray-900'
                                )}
                              >
                                Envoyer un email
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                <div className="flex flex-col mt-1 text-sm">
                  <span className="text-teal-800/80">{contact.phone}</span>
                  <span className="text-gray-500 ">
                    {contact.mail.toLowerCase()}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    )
  );
}
