import { FormEvent, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Link, Navigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useAppState } from '../../hooks/appState';
import { logout as logoutRequest } from '../../api/user';
import { removeUserDataFromLocalStorage } from '../../utils/user';
import AlertBase from './components/ModalBase';

interface Props {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAnswerCount: React.Dispatch<React.SetStateAction<number>>;
}

function ModalInactivityDetector({ setIsOpenModal, setAnswerCount }: Props) {
  const { setUserState } = useAppState();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpenModal(false);
    setAnswerCount((prev) => prev + 1);
  };
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalID);
  });

  const handleLogout = () => {
    logoutRequest().finally(() => {
      removeUserDataFromLocalStorage();
      setUserState((prev) => ({
        ...prev,
        isLogged: false,
        isActive: false,
        lastActionDate: null,
        token: null,
      }));
    });
    setIsOpenModal(false);
  };
  if (countdown <= 0) {
    handleLogout();
    return <Navigate to="/login" />;
  }
  return (
    <AlertBase setIsOpenModal={setIsOpenModal} isOpenModal>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
            <ClockIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Toujours présent·e ?
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                En cas d&apos;inactivité, vous serez deconnecté·e <br />
                dans un délai de 60 secondes
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <Link
            to="/login"
            className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            onClick={handleLogout}
          >
            {`Se déconnecter (${countdown}s)`}
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          >
            Rester connecté·e
          </button>
        </div>
      </form>
    </AlertBase>
  );
}

export default ModalInactivityDetector;
