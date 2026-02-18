/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppState } from '../../hooks/appState';
import { fetchRoles, fetchZones } from '../../api/admin';
import { fetchCategories, fetchDays } from '../../api/organisms';
import { fetchMe } from '../../api/user';
import { getUserDataFromLocalStorage, removeUserDataFromLocalStorage } from '../../utils/user';
import NoMobile from '../Errors/NoMobile';
import Sidebar from '../BackOffice/Sidebar/SideBase';
import Header from '../BackOffice/Header';
import BackOfficeContext from '../../context/BackOfficeContext';

export default function App() {
  const { organismState, setAdminState, setOrganismState, setUserState, userState } = useAppState();
  const user = getUserDataFromLocalStorage();
  const { pathname } = useLocation();
  const { langue } = organismState;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setOrganismState(prev => ({ ...prev, isLoading: true }));
      const categories = await fetchCategories();
      setOrganismState(prev => ({
        ...prev,
        categories,
        isLoading: false,
      }));
    };
    loadCategories();
  }, [setOrganismState]);

  useEffect(() => {
    const loadDays = async () => {
      const days = await fetchDays(1);
      setOrganismState(prev => ({ ...prev, days }));
    };
    loadDays();
  }, [setOrganismState, langue]);

  useEffect(() => {
    const loadAdminData = async () => {
      const [zones, roles] = await Promise.all([fetchZones(), fetchRoles()]);
      setAdminState(prev => ({ ...prev, zones, roles }));
    };
    loadAdminData();
  }, [setAdminState]);

  useEffect(() => {
    async function check() {
      setIsLoading(true);
      try {
        const [meData, zones] = await Promise.all([fetchMe({ force: true }), fetchZones({ force: true })]);

        if (!meData) {
          navigate('/login');
          return;
        }
        const roleName = typeof meData.role === 'string' ? meData.role : meData.role?.name;

        if (roleName === 'UserToDelete') {
          removeUserDataFromLocalStorage();
          setUserState(prev => ({
            ...prev,
            isLogged: false,
            isActive: false,
            lastActionDate: null,
            token: null,
            roleName: null,
            isAdmin: false,
            error: 'Votre compte est en cours de suppression.',
          }));
          navigate('/login');
          return;
        }

        const isAdminRole = roleName === 'Administrator' || roleName === 'RefLocal';
        const zoneName = zones.find(zone => zone.id === meData.zone)?.name || null;
        const hasStoredCity = !!localStorage.getItem('city');

        const nextCity = !isAdminRole ? zoneName : hasStoredCity ? localStorage.getItem('city') : zoneName;
        if (nextCity) {
          localStorage.setItem('city', nextCity);
        }

        setUserState(prev => ({
          ...prev,
          isAdmin: isAdminRole,
          roleName: roleName || null,
          city: nextCity,
        }));
      } catch (error) {
        // If auth check fails, return to login
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, [navigate, setUserState]);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return (
    <BackOfficeContext>
      <div className='md:hidden'>
        <NoMobile />
      </div>
      <div className='hidden bg-white md:block dark:bg-gray-900 dark:text-gray-100'>
        {!isLoading && (
          <>
            {userState.roleName === 'NewUser' ? (
              <Outlet />
            ) : (
              <>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div
                  className={` flex flex-col flex-1  lg:pl-20 ${pathname !== '/admin/dashboard' && '2xl:pl-72 '} ${
                    pathname === '/admin/dashboard' || pathname === '/admin/profil'
                      ? 'h-full min-h-full'
                      : 'h-max min-h-max'
                  } bg-white dark:bg-gray-900`}
                >
                  <Header setSidebarOpen={setSidebarOpen} />
                  <Outlet />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </BackOfficeContext>
  );
}
