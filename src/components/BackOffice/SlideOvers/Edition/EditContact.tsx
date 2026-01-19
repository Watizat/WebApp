import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Contact } from '../../../../@types/organism';
import { Inputs } from '../../../../@types/formInputs';
import { useAppState } from '../../../../hooks/appState';
import { fetchAdminOrganism } from '../../../../api/admin';
import { editContact } from '../../../../api/crud';
import {
  validateEmail,
  validatePhoneNumber,
} from '../../../../utils/form/form';
import Slide from '../components/Slide';
import Header from '../components/Header';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import BtnCloseValid from '../components/BtnCloseValid';
import ToggleEdit from '../../components/ToggleEdit';

interface Props {
  isOpenSlide: boolean;
  setIsOpenSlide: (open: boolean) => void;
  contact: Contact;
}

export default function EditOrgaContact({
  isOpenSlide,
  setIsOpenSlide,
  contact,
}: Props) {
  const { adminState, crudState, setAdminState, setCrudState } = useAppState();

  const {
    register, // Récupère les fonctions register
    handleSubmit, // Récupère la fonction handleSubmit
    formState: { errors }, // Récupère les erreurs
    reset, // Ajoutez la fonction reset pour réinitialiser le formulaire
  } = useForm<Inputs>();

  // Réinitialiser le formulaire à l'ouverture de la slide
  useEffect(() => {
    if (isOpenSlide) {
      reset();
    }
  }, [isOpenSlide, reset]);

  const id = adminState.organism?.id as number;
  const { isSaving } = crudState;

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const contactId = contact.id;
    setCrudState({ isSaving: true });
    await editContact({ formData, contactId });
    setIsOpenSlide(false);
    const organismData = await fetchAdminOrganism(id);
    setAdminState((prev) => ({ ...prev, organism: organismData }));
    setCrudState({ isSaving: false });
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
        <input type="text" hidden value={contact.id} {...register('id')} />
        <div className="flex-1 overflow-y-auto">
          <Header
            title="Editer les informations de l'organisme"
            setIsOpenSlide={setIsOpenSlide}
          />
          <div className="flex flex-col justify-between flex-1">
            <div className="px-4 pt-6 pb-5 space-y-3 sm:px-6">
              <Input
                data={{
                  type: 'text',
                  label: 'Prénom, nom, surnom, alias, collectif',
                  defaultValue: contact.name,
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
                  defaultValue: contact.job,
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
                  defaultValue: contact.phone,
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
                  defaultValue: contact.mail,
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
                  defaultValue: contact.visibility,
                  register: 'visibility',
                }}
                formMethods={{ register }}
              />
              <ToggleEdit
                data={{
                  label: 'Actualisation',
                  description: 'A contacter pour les actualisations ?',
                  defaultValue: contact.actualisation,
                  register: 'actualisation',
                }}
                formMethods={{ register }}
              />
              <Textarea
                data={{
                  type: 'string',
                  label: 'Commentaires',
                  defaultValue: contact.comment,
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
