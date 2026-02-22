import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAppState } from '../../../hooks/appState';

interface Props {
  children: React.ReactNode;
  setIsOpenModal: (open: boolean) => void;
  isOpenModal: boolean;
}

export default function AlertBase({
  children,
  setIsOpenModal,
  isOpenModal,
}: Props) {
  const cancelButtonRef = useRef(null);
  const { themeMode } = useAppState();
  const isDark = themeMode === 'dark';

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setIsOpenModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 transition-opacity ${isDark ? 'bg-gray-900/80' : 'bg-gray-500 bg-opacity-75'}`} />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${
                  isDark ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-900'
                }`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
