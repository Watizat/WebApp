import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/appState';
import { getUserDataFromLocalStorage } from '../../utils/user';
import { logout as logoutRequest } from '../../api/user';
import { removeUserDataFromLocalStorage } from '../../utils/user';
import ModalInactivityDetector from '../Modals/InactivityDisconnection';

export default function InactivityDetector() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const { userState, setUserState } = useAppState();
  const { isActive, timeout, lastActionDate } = userState;

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    const currentTime = new Date();

    const lastestUpdate = Math.max(
      lastActionDate || 0,
      user?.lastActionDate || 0
    );

    if (isActive && currentTime.getTime() - lastestUpdate > timeout) {
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
    }
    let timeoutID: number | undefined;
    const showModal = () => {
      if (timeoutID) clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        setIsOpenModal(true);
        window.removeEventListener('mousemove', showModal);
      }, timeout);
    };

    const trackAction = () => {
      const userLS = getUserDataFromLocalStorage();
      if (isActive && !userLS) {
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
      }
      if (userLS) {
        const actionDate = new Date();
        localStorage.setItem(
          'user',
          JSON.stringify({ ...userLS, lastActionDate: actionDate.getTime() })
        );
      }
    };

    if (isActive) {
      window.addEventListener('mousemove', showModal);
      window.addEventListener('mousedown', trackAction);
      window.addEventListener('keydown', trackAction);
    }

    return () => {
      clearTimeout(timeoutID);
      window.removeEventListener('mousemove', showModal);
      window.removeEventListener('mousedown', trackAction);
      window.removeEventListener('keydown', trackAction);
    };
  }, [isActive, answerCount, lastActionDate, timeout, setUserState]);

  return (
    <>
      {isOpenModal && (
        <ModalInactivityDetector
          setIsOpenModal={setIsOpenModal}
          setAnswerCount={setAnswerCount}
        />
      )}
      <Outlet />
    </>
  );
}
