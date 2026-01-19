import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../../../hooks/appState';
import {
  formatPhoneNumber,
  addURLPrefix,
  removeURLPrefix,
} from '../../../../utils/format';

import EditOrgaGeneral from '../../SlideOvers/Edition/EditGeneral';
import Card from './components/Card';
import ArchiveOrganism from '../../../Modals/ArchiveOrganism';
import ArchivedCard from './Visibility';

export default function General() {
  const [isOpenSlide, setIsOpenSlide] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [visibilityAnswer, setVisibilityAnswer] = useState<[string, string]>([
    '',
    '',
  ]);
  const { adminState } = useAppState();
  const { organism } = adminState;

  if (organism === null) {
    return <span>Une erreur s&apos;est produite.</span>;
  }

  const contactDetails = [
    ...(organism.website
      ? [
          {
            title: 'Site Web',
            type: 'url',
            label: removeURLPrefix(organism.website),
            value: addURLPrefix(organism.website),
          },
        ]
      : []),
    ...(organism.phone
      ? [
          {
            title: 'Téléphone',
            type: 'tel',
            value: formatPhoneNumber(organism.phone),
          },
        ]
      : []),
    ...(organism.mail
      ? [{ title: 'Adresse email', type: 'mailto', value: organism.mail }]
      : []),
  ];

  const menuChoices = [
    {
      title: 'Modifier infos',
      onClick: () => {
        setIsOpenSlide(true);
      },
    },
    {
      title: 'Archiver organisme',
      onClick: () => {
        setIsOpenModal(true);
        setVisibilityAnswer([
          "Archiver l'organisme ?",
          "Êtes-vous sûr de vouloir archiver l'organisme ? Cette action peut être annulée à tout moment",
        ]);
      },
    },
  ];

  return (
    <>
      {/* Slide d'édition */}
      <EditOrgaGeneral
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        organism={organism}
      />
      {/* Modal de suppression */}
      <ArchiveOrganism
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
        visibilityAnswer={visibilityAnswer}
        organism={organism}
        confirmBtnText="Confirmer ma demande"
      />
      {/* Message d'organisme archivé */}
      {!organism.visible && (
        <ArchivedCard
          message={organism.visible_comment}
          setIsOpenModal={setIsOpenModal}
          setVisibilityAnswer={setVisibilityAnswer}
        />
      )}
      {/* Composant principal */}
      <Card
        title={organism.name}
        address={`${organism.address}, ${organism.zipcode} ${organism.city}`}
        srMessage="Information principales de l'organisme"
        headCard
        menuChoices={menuChoices}
      >
        {contactDetails.length > 0 && (
          <div
            className={`grid border-t rounded-b-lg border-gray-200/60 divide-y divide-gray-200 bg-gray-50 grid-cols-${contactDetails.length} md:divide-x md:divide-y-0`}
          >
            {contactDetails.map((item) => (
              <Link
                key={item.title}
                to={
                  item.type === 'url'
                    ? item.value
                    : `${item.type}:${item.value}`
                }
                {...(item.type === 'url' && { target: '_blank' })}
                className={`px-6 py-4 text-xs font-medium col-span-1${
                  contactDetails.length === 1
                    ? 'text-left w-full flex-1'
                    : ' text-center'
                }`}
              >
                <p>
                  <span className="text-slate-900">{item.title}</span> :{' '}
                  <span className="text-gray-600">
                    {item.label ?? item.value}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
