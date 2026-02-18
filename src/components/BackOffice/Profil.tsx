import { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/appState';
import { fetchRoles, fetchZones } from '../../api/admin';
import { DirectusUser } from '../../@types/user';
import { fetchMe } from '../../api/user';
import BackColor from '../Container/BackColor';
import SlideEditProfil from './SlideOvers/Profil/EditProfil';

export default function Profil() {
  const { adminState, setAdminState, themeMode } = useAppState();
  const { zones, roles } = adminState;
  const [me, setMe] = useState<DirectusUser | null>(null);
  const isDark = themeMode === 'dark';

  const [isOpenSlide, setIsOpenSlide] = useState(false);

  useEffect(() => {
    async function getUserInfos() {
      const meData = await fetchMe();
      setMe(meData);
    }
    getUserInfos();
    const loadAdminData = async () => {
      const [zones, roles] = await Promise.all([
        fetchZones(),
        fetchRoles(),
      ]);
      setAdminState((prev) => ({ ...prev, zones, roles }));
    };
    loadAdminData();
  }, [setAdminState]);

  if (!me) {
    return <div />;
  }

  const updateUser = (updatedUser: DirectusUser) => {
    setMe(updatedUser);
  };

  return (
    <>
      <BackColor>
        <main
          className={`flex flex-col items-center justify-center flex-1 w-full min-h-full pb-10 select-none ${
            isDark ? 'text-gray-100' : 'text-gray-700'
          }`}
        >
          <div className="w-full max-w-sm mx-auto">
            <h2
              className={`mt-6 text-2xl font-bold leading-9 tracking-tight text-center ${
                isDark ? 'text-gray-100' : 'text-slate-600'
              }`}
            >
              Informations de profil
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-semibold leading-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    Prénom
                  </label>
                  <div className="mt-2">
                    <input
                      disabled
                      value={me.first_name}
                      className={`block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 ${
                        isDark
                          ? 'text-gray-100 ring-gray-700 bg-gray-800/70'
                          : 'text-gray-800 ring-gray-200 bg-slate-200/10'
                      }`}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className={`block text-sm font-semibold leading-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
                    >
                      Nom de famille / surnom / pseudo
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      disabled
                      value={me.last_name}
                      className={`block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 ${
                        isDark
                          ? 'text-gray-100 ring-gray-700 bg-gray-800/70'
                          : 'text-gray-800 ring-gray-200 bg-slate-200/10'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6 ">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-semibold leading-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    Adresse email
                  </label>
                  <div className="mt-2">
                    <input
                      disabled
                      value={me.email}
                      className={`block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 ${
                        isDark
                          ? 'text-gray-100 ring-gray-700 bg-gray-800/70'
                          : 'text-gray-800 ring-gray-200 bg-slate-200/10'
                      }`}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="location"
                    className={`block text-sm font-semibold leading-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    Antenne locale
                  </label>
                  <select
                    disabled
                    defaultValue={me.zone}
                    className={`block w-full py-2 pl-3 pr-10 mt-2 border-0 rounded-md ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 ${
                      isDark
                        ? 'text-gray-100 ring-gray-700 bg-gray-800/70'
                        : 'text-gray-800 ring-gray-200 bg-slate-200/10'
                    }`}
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid items-end grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="location"
                    className={`block text-sm font-semibold leading-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    Rôle utilisateur·ice
                  </label>
                  <select
                    disabled
                    defaultValue={me.role}
                    className={`block w-full py-2 pl-3 pr-10 mt-2 border-0 rounded-md ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 ${
                      isDark
                        ? 'text-gray-100 ring-gray-700 bg-gray-800/70'
                        : 'text-gray-800 ring-gray-200 bg-slate-200/10'
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center sm:col-span-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenSlide(true)}
                    className={`rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset ${
                      isDark
                        ? 'bg-gray-800 text-gray-100 ring-gray-600 hover:bg-gray-700'
                        : 'bg-transparent text-gray-900 ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Modifier les informations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </BackColor>
      <SlideEditProfil
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        onUpdateUser={updateUser}
      />
    </>
  );
}
