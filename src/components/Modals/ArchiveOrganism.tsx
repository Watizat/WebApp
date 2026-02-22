import { useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { SubmitHandler, useForm } from 'react-hook-form';
import ModalBase from './components/ModalBase';
import { Inputs } from '../../@types/formInputs';
import Textarea from '../BackOffice/components/Textarea';

import { useAppState } from '../../hooks/appState';
import {
  fetchAdminOrganisms,
  fetchAdminOrganism,
} from '../../api/admin';
import { editOrganismVisibility } from '../../api/crud';
import { Organism } from '../../@types/organism';
import { useAppContext } from '../../context/BackOfficeContext';

interface Props {
  setIsOpenModal: (open: boolean) => void;
  isOpenModal: boolean;
  visibilityAnswer: [string, string];
  organism: Organism;
  confirmBtnText: string;
}

export default function ArchiveOrganism({
  setIsOpenModal,
  isOpenModal,
  visibilityAnswer,
  organism,
  confirmBtnText,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const { adminState, userState, setAdminState, setCrudState, themeMode } = useAppState();
  const isDark = themeMode === 'dark';

  // Réinitialiser le formulaire à l'ouverture de la Modal
  useEffect(() => {
    if (isOpenModal) {
      reset();
    }
  }, [isOpenModal, reset]);

  const organismId = adminState.organism?.id as number;

  // Récupération du contexte
  const appContext = useAppContext();
  const city = userState.city as string;

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const updatedVisibility = !organism.visible;
    setCrudState({ isSaving: true });
    await editOrganismVisibility({
      formData,
      organismId,
      isVisible: updatedVisibility,
    });
    reset();
    setIsOpenModal(false);
    const organismData = await fetchAdminOrganism(organismId);
    setAdminState((prev) => ({ ...prev, organism: organismData }));
    if (appContext) {
      const organisms = await fetchAdminOrganisms({ city });
      setAdminState((prev) => ({ ...prev, organisms, isLoading: false }));
    }
    setCrudState({ isSaving: false });
  };

  const updateVisibilityMessage: SubmitHandler<Inputs> = async (formData) => {
    // Mise à jour du message sans changer la visibilité
    setCrudState({ isSaving: true });
    await editOrganismVisibility({
      formData,
      organismId,
      isVisible: organism.visible, // La visibilité reste inchangée
    });

    reset();
    setIsOpenModal(false);

    // Rafraîchissement des données de l'organisme
    const organismData = await fetchAdminOrganism(organismId);
    setAdminState((prev) => ({ ...prev, organism: organismData }));

    // Rafraîchissement de la liste des organismes
    if (appContext) {
      const organisms = await fetchAdminOrganisms({
        city,
        isDisplayArchivedOrga: appContext.isDisplayArchivedOrga,
      });
      setAdminState((prev) => ({ ...prev, organisms, isLoading: false }));
    }
    setCrudState({ isSaving: false });
  };

  const cancelButtonRef = useRef(null);

  return (
    <ModalBase setIsOpenModal={setIsOpenModal} isOpenModal={isOpenModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:flex sm:items-start">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-yellow-200 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon
              className="w-6 h-6 text-yellow-700"
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title
                as="h3"
                className={`text-base font-semibold leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
              >
                {visibilityAnswer[0]}
              </Dialog.Title>
              <div className="mt-2">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{visibilityAnswer[1]}</p>
              </div>
            </div>
            <div className="pl-4 mt-4">
              <Textarea
                data={{
                  type: 'string',
                  label: "Message d'archivage",
                  defaultValue: organism.visible_comment,
                  register: 'visible_comment',
                  required: false,
                  placeholder: 'ex : Pas de réponse depuis plus de six mois',
                }}
                formMethods={{ register, errors }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSubmit(updateVisibilityMessage)}
            className={`px-2 py-1 mr-2 text-sm font-semibold rounded ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
          >
            Modifier le message
          </button>
          <button
            type="button"
            className={`inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold rounded-md shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ${
              isDark
                ? 'text-gray-100 bg-gray-800 ring-gray-700 hover:bg-gray-700'
                : 'text-gray-900 bg-white ring-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpenModal(false)}
            ref={cancelButtonRef}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto"
          >
            {confirmBtnText}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
