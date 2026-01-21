/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppState } from '../../hooks/appState';
import { fetchRoles, fetchZones } from '../../api/admin';
import { fetchCategories, fetchDays } from '../../api/organisms';
import { fetchMe } from '../../api/user';
import { getUserDataFromLocalStorage } from '../../utils/user';
import NoMobile from '../Errors/NoMobile';
import Sidebar from '../BackOffice/Sidebar/SideBase';
import Header from '../BackOffice/Header';
import BackOfficeContext from '../../context/BackOfficeContext';

export default function App() {
  const { organismState, setAdminState, setOrganismState, setUserState } = useAppState();
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
        const meData = await fetchMe();

        // User en attente de validation
        if (meData.role === 'NewUser') {
          setIsLoading(false);
          navigate('/new-user');
          return;
        }
        // Users en attente de supression
        if (meData.role === 'UserToDelete') {
          setIsLoading(false);
          navigate('/');
          return;
        }
        if (meData.role.name === 'Administrator') {
          setUserState(prev => ({ ...prev, isAdmin: true }));
        }
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
      <div className='hidden md:block'>
        {!isLoading && (
          <>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
              className={` flex flex-col flex-1  lg:pl-20 ${pathname !== '/admin/dashboard' && '2xl:pl-72 '} ${
                pathname === '/admin/dashboard' || pathname === '/admin/profil'
                  ? 'h-full min-h-full'
                  : 'h-max min-h-max'
              }`}
            >
              <Header setSidebarOpen={setSidebarOpen} />
              <Outlet />
            </div>
          </>
        )}
      </div>
    </BackOfficeContext>
  );
}
