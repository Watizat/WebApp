import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ModalBase from './components/ModalBase';
import styles from '../../styles/markdown.module.css';

interface Release {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  publishedAt: string;
  body: string;
  version: string;
}

interface Props {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const replaceIssueLinks = (body: string): string => {
  const regex = /https:\/\/github\.com\/Watizat\/web_app\/issues\/(\d+)/g;
  return body.replace(regex, '(#$1)');
};

export default function Versions({ isOpenModal, setIsOpenModal }: Props) {
  const [versions, setVersions] = useState<Release[]>([]);

  useEffect(() => {
    const fetchGitHubReleases = async () => {
      const apiUrl = 'https://api.github.com/repos/Watizat/web_app/releases';

      const response = await fetch(apiUrl);
      const releases: Release[] = await response.json();
      const formattedVersions = releases.map((release) => ({
        version: release.tag_name,
        name: release.name,
        url: release.html_url,
        publishedAt: new Date(release.published_at).toLocaleDateString(
          'fr-FR',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        ), // Formatage de la date
        tag_name: '',
        html_url: '',
        published_at: '',
        body: replaceIssueLinks(release.body), // Replace issue links
      }));

      setVersions(formattedVersions);
    };

    fetchGitHubReleases();
  }, []);

  return (
    <ModalBase isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
      <div className="py-2 sm:flex sm:items-start max-h-[75vh]  m-auto flex flex-col flex-1 mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <Dialog.Title
          as="h2"
          className="flex justify-between flex-1 w-full mb-8 text-3xl font-medium leading-6 text-slate-700/80"
        >
          Quelles nouvelles ?
          <button
            type="button"
            className="relative text-gray-500 hover:text-gray-500"
            onClick={() => setIsOpenModal(false)}
          >
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Close panel</span>
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </Dialog.Title>
        <ul className="flex flex-col gap-y-6 overflow-auto flex-1 w-full">
          {versions.map((version) => (
            <li key={version.version} className="flex flex-col ">
              <div className="text-xl font-semibold text-slate-600">
                {version.name} - {version.publishedAt}
              </div>
              <ReactMarkdown className={styles.markdown}>
                {version.body}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end mt-4 bg-white">
        <button
          type="button"
          className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setIsOpenModal(false)}
        >
          Fermer
        </button>
      </div>
    </ModalBase>
  );
}
