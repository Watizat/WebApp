import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../../assets/logo-color.svg';
import headerLinks from './source';
import footerLinks from '../Footer/source';
import { getUserDataFromLocalStorage } from '../../../utils/user';
import ThemeToggle from '../../shared/ThemeToggle';

export default function HeaderSlim() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNav = headerLinks.concat(footerLinks);
  const user = getUserDataFromLocalStorage();

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 bg-white border-b border-gray-900/10 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between w-full px-4 md:mx-auto sm:px-6 lg:px-8 md:max-w-screen-2xl ">
        <div className="flex items-center flex-1 md:justify-between md:mx-auto md:gap-x-6 md:hidden">
          <button
            type="button"
            className="p-3 -m-3 "
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="w-6 h-6 text-gray-900 dark:text-gray-100" aria-hidden="true" />
          </button>
        </div>
        <Link to="/" className="-m-2.5 md:-m-1.5 p-1.5 ">
          <span className="sr-only">Watizat</span>
          <img className="w-auto h-10" src={logo} alt="watizat logo" />
        </Link>
        <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700 dark:text-gray-100">
          {headerLinks.map((item) => (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-end flex-1 gap-x-8 md:flex-initial">
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            to={`${user ? '/admin/dashboard' : '/login'}`}
            className="hidden text-sm font-semibold leading-6 text-gray-900 md:flex dark:text-gray-100"
          >
            Membres Watizat&nbsp;&nbsp;
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full px-4 pb-6 overflow-y-auto bg-white sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:ring-gray-700">
          <div className="flex items-center justify-between h-16 ">
            <div className="flex flex-1">
              <button
                type="button"
                className="p-3 -m-3 text-gray-700 rounded-md dark:text-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <Link to="/" className="-m-2.5 md:-m-1.5 p-1.5">
              <span className="sr-only">Watizat</span>
              <img className="w-auto h-10" src={logo} alt="" />
            </Link>
            <div className="justify-end flex-1 md:flex">
              <Link
                to={`${user ? '/admin/dashboard' : '/login'}`}
                className="hidden text-sm font-semibold leading-6 text-gray-900 md:flex dark:text-gray-100"
              >
                Membres Watizat&nbsp;&nbsp;
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>{' '}
          </div>
          <div className="mt-4">
            <ThemeToggle />
          </div>
          <div className="mt-2 space-y-2">
            {mobileNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                {item.name}
              </a>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
