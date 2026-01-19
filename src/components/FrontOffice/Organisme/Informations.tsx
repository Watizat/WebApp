import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useAppState } from '../../../hooks/appState';
import Schedules from '../../components/Schedules';

export default function Informations() {
  const { organismState } = useAppState();
  const { organism } = organismState;

  if (organism === null) {
    return <span>Erreur</span>;
  }

  return (
    <>
      {organism.translations[0]?.infos_alerte && (
        <div className="text-sm leading-6 rounded-lg ring-1 ring-red-500/10">
          <div className="flex px-4 py-3 rounded-md bg-red-50/80">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="w-5 h-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col ml-3">
              <h3 className="text-sm font-semibold text-yellow-800">
                Infos / alertes
              </h3>
              <p className="mt-1 text-sm font-medium leading-tight text-yellow-800 truncate whitespace-normal lg:leading-tight">
                {organism.translations[0]?.infos_alerte}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 ">
        <h3 className="mb-3 ml-1 text-sm font-semibold text-slate-600/80">
          Horaires & description
        </h3>
        <div className="flex flex-1 gap-4 rounded-lg shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg sm:px-6 ">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col py-6 text-sm text-justify text-gray-500 sm:mx-0 gap-y-2 basis-8/12">
              <p>{organism?.translations?.[0]?.description}</p>
            </div>
          </div>{' '}
          {/* Separator */}
          <div
            className="hidden m-auto lg:block lg:h-44 lg:w-px lg:bg-gray-100"
            aria-hidden="true"
          />
          <div className="basis-4/12 ">
            <div className="flex flex-col">
              <div className="py-4 pl-4 text-sm">
                <Schedules schedule={organism?.schedules} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
