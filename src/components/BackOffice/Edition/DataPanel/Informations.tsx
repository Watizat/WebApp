import { useState } from 'react';
import { useAppState } from '../../../../hooks/appState';
import Card from './components/Card';
import SwitchToogle from '../../components/ToggleDisplay';
import Schedules from '../../../components/Schedules';
import EditOrgaInfos from '../../SlideOvers/Edition/EditInfos';

export default function Informations() {
  const [isOpenSlide, setIsOpenSlide] = useState(false);
  const { adminState } = useAppState();
  const { organism } = adminState;
  if (organism === null) {
    return <span>Erreur</span>;
  }

  const menuChoices = [
    {
      title: 'Modifier infos',
      onClick: () => {
        setIsOpenSlide(true);
      },
    },
  ];

  return (
    <>
      {/* Slide d'édition */}
      <EditOrgaInfos
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        organism={organism}
      />
      {/*  Composant principal */}
      <Card
        title="Informations"
        srMessage="Information de l'organisme"
        menuChoices={menuChoices}
      >
        <div className="flex flex-col gap-4 pt-4 divide-x divide-gray-100 pb-7 px-7 lg:flex-row">
          <div className="flex flex-col gap-4 divide-y divide-gray-100 basis-7/12">
            <div className="flex flex-col gap-2 text-gray-500">
              <h2 className="text-sm font-medium text-black">Accessibilité</h2>
              <div className="flex justify-between flex-1 pr-6">
                <SwitchToogle
                  disable
                  enabled={organism.pmr}
                  title="Accessible PSH / PMR"
                />
                <SwitchToogle
                  disable
                  enabled={organism.animals}
                  title="Animaux acceptés"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 text-gray-500">
              <h2 className="text-sm font-medium text-black">
                Infos & alertes
              </h2>
              <p className="text-sm font-normal text-justify text-gray-500">
                {organism.translations[0]?.infos_alerte}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4 text-gray-500">
              <h2 className="text-sm font-medium text-black">Description</h2>
              <p className="text-sm font-normal text-justify text-gray-500">
                {organism.translations[0]?.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-4 2xl:pl-10 basis-5/12">
            <h2 className="text-sm font-medium text-black">Horaires</h2>
            <div>
              {organism.schedules && organism.schedules.length > 0 ? (
                <Schedules schedule={organism.schedules} />
              ) : (
                <p>Il n&apos;y a pas d&apos;horaires enregistrés.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
