import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs } from '../../../../@types/formInputs';
import { useAppState } from '../../../../hooks/appState';
import { fetchAdminOrganism } from '../../../../api/admin';
import { addService } from '../../../../api/crud';

import Slide from '../components/Slide';
import Header from '../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';
import BtnCloseValid from '../components/BtnCloseValid';
import Textarea from '../../components/Textarea';
import SchedulesTable from '../../components/SchedulesTable';

interface Props {
  isOpenSlide: boolean;
  setIsOpenSlide: (open: boolean) => void;
}

export default function NewOrganism({ isOpenSlide, setIsOpenSlide }: Props) {
  const {
    register, // Récupère les fonctions register
    handleSubmit, // Récupère la fonction handleSubmit
    formState: { errors }, // Récupère les erreurs
    reset, // Ajoutez la fonction reset pour réinitialiser le formulaire
  } = useForm<Inputs>();

  const { adminState, organismState, crudState, setAdminState, setCrudState } =
    useAppState();
  const { categories: categoriesList, days } = organismState;
  const organismId = adminState.organism?.id as number;
  const { isSaving } = crudState;

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setCrudState({ isSaving: true });
    await addService(formData);
    setIsOpenSlide(false);
    const organismData = await fetchAdminOrganism(organismId);
    setAdminState((prev) => ({ ...prev, organism: organismData }));
    reset();
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
        <div className="flex-1 overflow-y-auto">
          <Header
            title="Créer un nouveau service"
            setIsOpenSlide={setIsOpenSlide}
          />
          <div className="flex flex-col justify-between flex-1">
            <input
              type="number"
              defaultValue={organismId}
              hidden
              {...register('organisme_id')}
            />
            <div className="px-4 pt-6 pb-5 space-y-3 sm:px-6">
              <Select
                data={{
                  label: 'Catégorie du service',
                  register: 'categorie_id',
                  required: true,
                }}
                formMethods={{ register, errors }}
              >
                <option disabled>Selectionnez une catégorie</option>
                {categoriesList.map((category) => (
                  <option
                    key={category.translations[0].name}
                    value={`${category.id}`}
                  >
                    {category.translations[0].name}
                  </option>
                ))}
              </Select>
              <Input
                data={{
                  type: 'string',
                  label: 'Nom du service',
                  register: 'name',
                  required: true,
                  placeholder: 'Nom du service proposé',
                }}
                formMethods={{ register, errors }}
              />
              <Textarea
                data={{
                  type: 'string',
                  label: 'Description',
                  register: 'description',
                  required: false,
                  placeholder: 'Décrire ici les missions du service',
                }}
                formMethods={{ register, errors }}
              />
              <SchedulesTable
                data={{
                  days,
                  register: 'schedules',
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
