import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs } from '../../../../@types/formInputs';
import { DirectusUser } from '../../../../@types/user';
import { useAppState } from '../../../../hooks/appState';
import { fetchUsers } from '../../../../api/admin';
import { editUser, updateUserStatus, fetchMe } from '../../../../api/user';
import { validateEmail } from '../../../../utils/form/form';
import Slide from '../components/Slide';
import Header from '../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';

import BtnCloseValid from '../components/BtnCloseValid';
import DeleteConfirmation from '../../../Modals/DeleteConfirmation';

interface Props {
  isOpenSlide: boolean;
  setIsOpenSlide: (open: boolean) => void;
  user: DirectusUser;
}

export default function SlideEditUser({
  isOpenSlide,
  setIsOpenSlide,
  user,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const { adminState, userState, setAdminState } = useAppState();
  const { zones, roles } = adminState;
  const { isAdmin, city } = userState;

  const handleCloseSlide = () => {
    setIsOpenSlide(false); // Ferme la slide
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    await editUser(formData);
    const cityLocal = localStorage.getItem('city');

    const cityId = cityLocal
      ? zones.find((zone) => zone.name === cityLocal)
      : zones.find((zone) => zone.name === city);
    const me = await fetchMe();
    if (isAdmin) {
      if (cityId !== undefined) {
        const usersList = await fetchUsers(cityId.id.toString());
        setAdminState((prev) => ({ ...prev, users: usersList }));
      } else {
        const usersList = await fetchUsers(null);
        setAdminState((prev) => ({ ...prev, users: usersList }));
      }
    } else if (me?.zone) {
      const usersList = await fetchUsers(me.zone.toString());
      setAdminState((prev) => ({ ...prev, users: usersList }));
    }
    setIsOpenSlide(false);
  };

  async function reActiveUser(userId: string) {
    try {
      await updateUserStatus(userId, 'active');
      handleCloseSlide();
      const usersList = await fetchUsers(user.zone.toString());
      setAdminState((prev) => ({ ...prev, users: usersList }));
    } catch (error) {
      // Gérer les erreurs ici
    }
  }

  async function archiveUser(userId: string) {
    try {
      await updateUserStatus(userId, 'archived');
      handleCloseSlide();
    } catch (error) {
      // Gérer les erreurs ici
    }
  }

  return (
    <>
      <DeleteConfirmation
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
        handleDeleteConfirm={() => archiveUser(user.id)}
        title="Suppression du compte"
        message={`Êtes-vous sûr de vouloir valider la suppression du compte de ${user.first_name} ${user.last_name}? Cette action est irréversible`}
        deleteBtnText="Confirmer la suppression"
      />
      <Slide isOpenSlide={isOpenSlide} setIsOpenSlide={setIsOpenSlide}>
        <form
          // onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl select-none"
        >
          <input type="text" hidden value={user.id} {...register('id')} />
          <div className="flex-1 overflow-y-auto">
            <Header
              title="Editer les données du contact"
              setIsOpenSlide={setIsOpenSlide}
            />
            <div className="flex flex-col justify-between flex-1">
              <div className="px-4 pt-6 pb-5 space-y-3 sm:px-6">
                <Input
                  data={{
                    type: 'text',
                    defaultValue: user.first_name,
                    register: 'first_name',
                    required: true,
                    placeholder: 'Prénom',
                  }}
                  formMethods={{ register, errors }}
                />
                <Input
                  data={{
                    type: 'text',
                    defaultValue: user.last_name,
                    register: 'last_name',
                    required: true,
                    placeholder: 'Nom de famille / surnom ou pseudo',
                  }}
                  formMethods={{ register, errors }}
                />
                <Input
                  data={{
                    type: 'email',
                    defaultValue: user.email,
                    register: 'email',
                    required: true,
                    placeholder: 'Adresse email',
                    validate: validateEmail,
                  }}
                  formMethods={{ register, errors }}
                />
                {isAdmin && (
                  <Select
                    data={{
                      label: 'Antenne locale',
                      defaultValue: user.zone,
                      register: 'zone',
                      required: false,
                    }}
                    formMethods={{ register, errors }}
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </Select>
                )}
                <Select
                  data={{
                    label: 'Rôle utilisateur·ice',
                    defaultValue: user.role,
                    register: 'role',
                    required: false,
                  }}
                  formMethods={{ register, errors }}
                >
                  {isAdmin &&
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  {!isAdmin &&
                    roles
                      .filter(
                        (filteredRole) => filteredRole.name !== 'Administrator'
                      )
                      .map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                </Select>
                <div className="flex items-center py-4 mt-5 text-sm text-gray-600 group ">
                  <span>
                    En cas d&apos;oubli de mot de passe, il revient à
                    l&apos;utilisateur·ice, de faire une demande de
                    réinitialisation de mot de passe, via la page de login.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end px-4 py-6 gap-y-5">
            {user.status === 'suspended' && (
              <div className="flex justify-start flex-shrink-0">
                <button
                  type="button"
                  className="px-3 text-sm font-semibold text-green-500"
                  onClick={() => reActiveUser(user.id)}
                >
                  Réactiver le compte utilisateur·ice
                </button>
              </div>
            )}
            <div className="flex justify-start flex-shrink-0">
              <button
                type="button"
                className="px-3 text-sm font-semibold text-red-500"
                onClick={() => setIsOpenModal(true)}
              >
                Supprimer définitivement l&apos;utilisateur·ice
              </button>
            </div>
          </div>
          <BtnCloseValid
            handleCloseSlide={handleCloseSlide}
            handleValidation={handleSubmit(onSubmit)}
          />
        </form>
      </Slide>
    </>
  );
}
