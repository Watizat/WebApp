import { useEffect } from 'react';
import UserLine from './UserLine';
import { useAppState } from '../../../hooks/appState';
import { fetchUsers } from '../../../api/admin';
import { fetchMe } from '../../../api/user';

export default function Users() {
  const { adminState, userState, setAdminState, setUserState } = useAppState();
  const { users, zones } = adminState;
  const { city } = userState;

  useEffect(() => {
    const fetchData = async () => {
      const cityLocal = localStorage.getItem('city');

      const cityId = cityLocal ? zones.find(zone => zone.name === cityLocal) : zones.find(zone => zone.name === city);
      const meData = await fetchMe({ force: true });
      if (!meData) {
        // Optionally handle the error or set fallback state here
        setUserState(prev => ({ ...prev, isAdmin: false, roleName: null }));
        setAdminState(prev => ({ ...prev, users: [] }));
        return;
      }
      const roleName = typeof meData.role === 'string' ? meData.role : meData.role?.name;
      const isAdminRole = roleName === 'Administrator' || roleName === 'RefLocal';
      setUserState(prev => ({ ...prev, isAdmin: isAdminRole, roleName: roleName || null }));
      if (isAdminRole) {
        if (cityId !== undefined) {
          const usersList = await fetchUsers(cityId.id.toString());
          setAdminState(prev => ({ ...prev, users: usersList }));
        } else {
          const usersList = await fetchUsers(null);
          setAdminState(prev => ({ ...prev, users: usersList }));
        }
        return;
      }

      if (meData.zone) {
        const usersList = await fetchUsers(meData.zone.toString());
        setAdminState(prev => ({ ...prev, users: usersList }));
      }
    };

    fetchData();
  }, [setAdminState, setUserState, zones, city]);

  return (
    <main className='flex flex-col flex-1 min-w-full align-middle bg-white h-max min-h-max sm:px-6 lg:px-8 grow'>
      <table className='min-w-full select-none'>
        <thead className='sticky z-10 w-full bg-white top-16'>
          <tr>
            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 '>
              Utilisateur·ice
            </th>
            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
              Rôle
            </th>
            <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
              Antenne locale
            </th>
            <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
              Dernière connexion
            </th>
            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
              Email
            </th>
            <th scope='col' className='px-3 py-3.5 text-right text-sm font-semibold text-white'>
              Edit
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {users
            .filter(user => user.status !== 'archived') // Filtrez les utilisateurs par statut "actif"
            .sort((a, b) => a.first_name.localeCompare(b.first_name)) // Triez le tableau par le prénom
            .map(user => (
              <UserLine key={user.email} user={user} />
            ))}
        </tbody>
      </table>
    </main>
  );
}
