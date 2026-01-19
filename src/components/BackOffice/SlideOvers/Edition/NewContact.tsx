import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Inputs } from '../../../../@types/formInputs';
import { useAppState } from '../../../../hooks/appState';
import { fetchAdminOrganism } from '../../../../api/admin';
import { addOrganismContact, addServiceContact } from '../../../../api/crud';
import {
  validateEmail,
  validatePhoneNumber,
} from '../../../../utils/form/form';
import { Service } from '../../../../@types/organism';
import Slide from '../components/Slide';
import Header from '../components/Header';
import Input from '../../components/Input';
import BtnCloseValid from '../components/BtnCloseValid';
import Textarea from '../../components/Textarea';
import ToggleEdit from '../../components/ToggleEdit';

interface Props {
  isOpenSlide: boolean;
  setIsOpenSlide: (open: boolean) => void;
  // eslint-disable-next-line react/require-default-props
  service?: Service;
}

export default function NewContact({
  isOpenSlide,
  setIsOpenSlide,
  service,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { crudState, adminState, setAdminState, setCrudState } = useAppState();
  const { isSaving } = crudState;
  const organismId = adminState.organism?.id as number;

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      let response;

      if (service) {
        setCrudState({ isSaving: true });
        await addServiceContact(formData);
        response = { meta: { requestStatus: 'fulfilled' } };
      } else {
        setCrudState({ isSaving: true });
        await addOrganismContact(formData);
        response = { meta: { requestStatus: 'fulfilled' } };
        if (response.meta.requestStatus !== 'fulfilled') {
          setErrorMessage(
            'Une erreur est survenue lors de la création du contact.'
          );
        }
      }

      setIsOpenSlide(false);
      const organismData = await fetchAdminOrganism(organismId);
      setAdminState((prev) => ({ ...prev, organism: organismData }));
      setCrudState({ isSaving: false });
    } catch (error) {
      // Gérer les erreurs ici
      // eslint-disable-next-line no-console
      console.error('Une erreur est survenue :', error);
    }
  };

  const handleCloseSlide = () => {
    reset(); // Réinitialise le formulaire à la fermeture de la slide
    setIsOpenSlide(false); // Ferme la slide
  };

  return (
    <Slide isOpenSlide={isOpenSlide} setIsOpenSlide={setIsOpenSlide}>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl select-none"
      >
        <div className="flex-1 overflow-y-auto">
          <Header
            title={`Créer un nouveau contact ${
              service ? 'pour le service' : "pour l'organisme"
            }`}
            setIsOpenSlide={setIsOpenSlide}
          />
          <div className="flex flex-col justify-between flex-1">
            {service ? (
              <input
                type="number"
                defaultValue={service.id}
                hidden
                {...register('service')}
              />
            ) : (
              <input
                type="number"
                defaultValue={organismId}
                hidden
                {...register('organisme')}
              />
            )}
            <div className="px-4 pt-6 pb-5 space-y-3 sm:px-6">
              <Input
                data={{
                  type: 'text',
                  label: 'Prénom, nom, surnom, alias, collectif',
                  register: 'name',
                  required: true,
                  placeholder: 'ex : Irène Dresel',
                }}
                formMethods={{ register, errors }}
              />
              <Input
                data={{
                  type: 'text',
                  label: 'Fonction, service, commission',
                  register: 'job',
                  required: false,
                  placeholder: 'ex : Cheffe de service',
                }}
                formMethods={{ register, errors }}
              />
              <Input
                data={{
                  type: 'string',
                  label: 'Télephone principal',
                  register: 'phone',
                  required: false,
                  placeholder: 'ex : 0561216760',
                  validate: validatePhoneNumber,
                }}
                formMethods={{ register, errors }}
              />
              <Input
                data={{
                  type: 'string',
                  label: 'Adresse email',
                  register: 'mail',
                  required: false,
                  placeholder: 'ex : contact@acab.fr',
                  validate: validateEmail,
                }}
                formMethods={{ register, errors }}
              />
              <ToggleEdit
                data={{
                  label: 'Visibilité',
                  description: 'Ce contact doit-il être rendu public ?',
                  register: 'visibility',
                }}
                formMethods={{ register }}
              />
              <ToggleEdit
                data={{
                  label: 'Actualisation',
                  description: 'A contacter pour les actualisations ?',
                  register: 'actualisation',
                }}
                formMethods={{ register }}
              />
              <Textarea
                data={{
                  type: 'string',
                  label: 'Commentaires',
                  register: 'comment',
                  required: false,
                  placeholder: 'ex : Ne pas contacter les weekends',
                }}
                formMethods={{ register, errors }}
              />
            </div>
          </div>
        </div>
        <BtnCloseValid
          isSaving={isSaving}
          handleCloseSlide={handleCloseSlide}
          handleValidation={handleSubmit(onSubmit)}
        />
      </form>
    </Slide>
  );
}
