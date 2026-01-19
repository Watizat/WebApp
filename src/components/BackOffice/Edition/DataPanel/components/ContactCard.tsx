import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../../../../hooks/appState';
import { fetchAdminOrganism } from '../../../../../api/admin';
import { deleteContact } from '../../../../../api/crud';
import { Contact } from '../../../../../@types/organism';
import { formatPhoneNumber } from '../../../../../utils/format';
import VerticalMenu from '../../../../components/VerticalMenu';
import EditOrgaContact from '../../../SlideOvers/Edition/EditContact';
import DeleteConfirmation from '../../../../Modals/DeleteConfirmation';

interface Props {
  contact: Contact;
  index: number;
  serviceContact?: boolean;
  oneLine?: boolean;
}

export default function ContactCard({
  contact,
  index,
  serviceContact,
  oneLine,
}: Props) {
  const [isOpenSlide, setIsOpenSlide] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { adminState, setAdminState } = useAppState();

  const menuChoices = [
    {
      title: 'Modifier contact',
      onClick: () => {
        setIsOpenSlide(true);
      },
    },
    {
      title: 'Supprimer contact',
      onClick: () => {
        setIsOpenModal(true);
      },
    },
  ];

  const organismId = adminState.organism?.id as number;

  async function handleDeleteConfirm(contactId: number) {
    await deleteContact(contactId);
    const organismData = await fetchAdminOrganism(organismId);
    setAdminState((prev) => ({ ...prev, organism: organismData }));
    setIsOpenSlide(false);
    setIsOpenModal(false);
  }

  return (
    <>
      {/* Slide d'édition */}
      <EditOrgaContact
        isOpenSlide={isOpenSlide}
        setIsOpenSlide={setIsOpenSlide}
        contact={contact}
      />
      {/*  Modal de suppression du contact */}
      <DeleteConfirmation
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
        handleDeleteConfirm={() => handleDeleteConfirm(contact.id)}
        title="Supprimer le contact"
        message="Êtes-vous sûr de vouloir supprimer ce contact ? Cette action n'est pas réversible"
        deleteBtnText="Confirmer ma demande"
      />
      {/* Composant principal */}
      <li
        className={`flex flex-col justify-start flex-1 w-full col-span-1 pt-2 pb-3 pl-4 pr-1 cursor-pointer border-b  ${
          serviceContact ? 'border-gray-100 border-l' : 'border-gray-200'
        } ${
          !serviceContact && index % 2 === 0 && 'border-r ' // Elements impairs
        }
        ${
          !serviceContact && oneLine && 'border-none ' // Elements impairs
        }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col flex-1">
            <div className="w-11/12 text-sm text-zinc-900">
              {contact.name ? contact.name : contact.job}
            </div>
            {contact.job && (
              <div className="w-11/12 text-xs text-gray-500">{contact.job}</div>
            )}
          </div>
          <div className="flex gap-1 mr-2">
            {contact.actualisation ? (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-indigo-700 rounded-md bg-indigo-50 ring-1 ring-inset ring-indigo-700/10">
                Actualisation
              </span>
            ) : null}
            {contact.visibility === false ? (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-pink-700 rounded-md bg-pink-50 ring-1 ring-inset ring-pink-700/10">
                Privé
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-inset ring-green-600/20">
                Public
              </span>
            )}
          </div>
          <VerticalMenu menuChoices={menuChoices} />
        </div>
        <div className="flex justify-between flex-1 gap-10 mt-2 mr-6 text-xs">
          <Link to={`tel:${contact.phone}`} className="text-teal-800/80">
            {formatPhoneNumber(contact.phone)}
          </Link>
          <Link to={`mailto:${contact.mail}`} className="text-gray-500 ">
            {contact.mail.toLowerCase()}
          </Link>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <span>{contact.comment}</span>
        </div>
      </li>
    </>
  );
}

ContactCard.defaultProps = {
  serviceContact: false,
  oneLine: false,
};
