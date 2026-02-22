import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../../assets/logo-color.svg';
import headerLinks from './source';
import footerLinks from '../Footer/source';
import { getUserDataFromLocalStorage } from '../../../utils/user';
import ThemeToggle from '../../shared/ThemeToggle';

export default function Default() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNav = headerLinks.concat(footerLinks);
  const user = getUserDataFromLocalStorage();

  return (
    <header className="z-10 bg-transparent">
      <nav
        className="flex items-center justify-between p-6 mx-auto max-w-7xl lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <div className="hidden lg:flex lg:gap-x-12">
            {headerLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                target={item.target}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <Link to="/" className="-m-2.5 md:-m-1.5 p-1.5 relative left-0">
          <span className="sr-only">Watizat</span>
          <img className="w-auto h-10" src={logo} alt="watizat logo" />
        </Link>
        <div className="flex items-center justify-end flex-1 gap-3">
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            to={`${user ? '/admin/dashboard' : '/login'}`}
            className="hidden text-sm font-semibold leading-6 text-gray-900 md:flex dark:text-gray-100"
          >
            Membres Watizat&nbsp;&nbsp;<span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full px-6 py-6 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex flex-1">
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <Link to="/" className="-m-2.5 md:-m-1.5 p-1.5 b">
              <span className="sr-only">Watizat</span>
              <img className="w-auto h-10" src={logo} alt="watizat logo" />
            </Link>
            <div className="justify-end flex-1 md:flex">
              <Link
                to={`${user ? '/admin/dashboard' : '/login'}`}
                className="hidden text-sm font-semibold leading-6 text-gray-900 md:flex dark:text-gray-100"
              >
                Membres Watizat&nbsp;&nbsp;
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <ThemeToggle />
          </div>
          <div className="mt-6 space-y-2">
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
