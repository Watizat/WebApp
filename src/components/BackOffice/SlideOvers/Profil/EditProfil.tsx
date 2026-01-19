import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAppState } from '../../../../hooks/appState';
import { fetchRoles, fetchZones } from '../../../../api/admin';
import {
  editUser,
  fetchMe,
  logout as logoutRequest,
  updateUserStatus,
} from '../../../../api/user';
import { DirectusUser } from '../../../../@types/user';
import { Inputs } from '../../../../@types/formInputs';
import { validateEmail } from '../../../../utils/form/form';
import { removeUserDataFromLocalStorage } from '../../../../utils/user';
import DeleteConfirmation from '../../../Modals/DeleteConfirmation';
import Slide from '../components/Slide';
import Header from '../components/Header';
import ValidationDouble from '../components/BtnCloseValid';
import Input from '../../components/Input';

interface Props {
  isOpenSlide: boolean;
  setIsOpenSlide: (open: boolean) => void;
  onUpdateUser: (updatedUser: DirectusUser) => void;
}

export default function EditSelfProfil({
  isOpenSlide,
  setIsOpenSlide,
  onUpdateUser,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Ajoutez la fonction reset pour réinitialiser le formulaire
  } = useForm<Inputs>();

  const { setAdminState, setUserState } = useAppState();
  const [me, setMe] = useState<DirectusUser | null>(null);
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const getUserInfos = async () => {
    try {
      return await fetchMe();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur :",
        error
      );
      return null;
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (formData.password === '') {
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      await editUser(formDataCopy);
    } else {
      await editUser(formData);
    }
    const updatedUserData = await getUserInfos();
    if (updatedUserData) {
      onUpdateUser(updatedUserData);
    }
    setIsOpenSlide(false);
  };

  const handleCloseSlide = () => {
    reset(); // Réinitialise le formulaire à la fermeture de la slide
    setIsOpenSlide(false); // Ferme la slide
  };

  async function suspendUser(userId: string) {
    try {
      await updateUserStatus(userId, 'suspended');
      setIsOpenModal(false);
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
      navigate('/');
    } catch (error) {
      // Gérer les erreurs ici
    }
  }

  async function fetchInitialData() {
    // Appel de getUserInfos uniquement si la diapositive est ouverte
    getUserInfos().then((userData) => {
      if (userData) {
        setMe(userData);
      }
    });
    const [zones, roles] = await Promise.all([fetchZones(), fetchRoles()]);
    setAdminState((prev) => ({ ...prev, zones, roles }));
  }

  useEffect(() => {
    if (isOpenSlide) {
      fetchInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenSlide]);

  if (!me) {
    return <div />;
  }

  return (
    <>
      <DeleteConfirmation
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
        handleDeleteConfirm={() => suspendUser(me.id)}
        title="Suppression du compte"
        message="Êtes-vous sûr de vouloir demander la supression de votre compte ? Toutes vos données seront perdues."
        deleteBtnText="Confirmer ma demande"
      />
      <Slide isOpenSlide={isOpenSlide} setIsOpenSlide={setIsOpenSlide}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
        >
          <input type="text" hidden {...register('id')} defaultValue={me.id} />
          <div className="flex-1 overflow-y-auto">
            <Header title="Editer mon profil" setIsOpenSlide={setIsOpenSlide} />
            <div className="flex flex-col justify-between flex-1">
              <div className="px-4 pt-6 pb-5 space-y-3 sm:px-6">
                <Input
                  data={{
                    type: 'text',
                    defaultValue: me.first_name,
                    register: 'first_name',
                    required: true,
                    placeholder: 'Prénom',
                  }}
                  formMethods={{ register, errors }}
                />
                <Input
                  data={{
                    type: 'text',
                    defaultValue: me.last_name,
                    register: 'last_name',
                    required: true,
                    placeholder: 'Nom de famille / surnom ou pseudo',
                  }}
                  formMethods={{ register, errors }}
                />
                <Input
                  data={{
                    type: 'email',
                    defaultValue: me.email,
                    register: 'email',
                    required: true,
                    placeholder: 'Adresse email',
                    validate: validateEmail,
                  }}
                  formMethods={{ register, errors }}
                />
                <Input
                  data={{
                    type: 'password',
                    register: 'password',
                    required: false,
                    label: 'Mot de passe',
                    placeholder:
                      'Entrez un nouveau mot de passe (si nécessaire)',
                  }}
                  formMethods={{ register, errors }}
                />
                <div>
                  <div className="flex items-center py-4 mt-5 text-sm text-gray-600 group ">
                    <span>
                      Pour modifier votre antenne locale de rattachement ou
                      votre rôle utilisateur·ice, merci de contacter un·e
                      administrateur·ice
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start flex-shrink-0 px-4 py-6">
            <button
              type="button"
              className="px-3 text-sm font-semibold text-red-500"
              onClick={() => setIsOpenModal(true)}
            >
              Demander la suppression de mon compte
            </button>
          </div>
          <ValidationDouble
            handleCloseSlide={handleCloseSlide}
            handleValidation={handleSubmit(onSubmit)}
          />
        </form>
      </Slide>
    </>
  );
}
