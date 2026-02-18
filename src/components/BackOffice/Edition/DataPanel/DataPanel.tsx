import { useAppState } from '../../../../hooks/appState';
import General from './General';
import Contacts from './Contacts';
import Informations from './Informations';
import Services from './Services';

export default function DataPanel() {
  const { adminState, themeMode } = useAppState();
  const { organism } = adminState;
  const isDark = themeMode === 'dark';

  if (organism === null) {
    return (
      <div
        className={`flex flex-col justify-center flex-1 h-full m-auto text-lg text-center item-center ${
          isDark ? 'text-gray-300' : 'text-zinc-600'
        }`}
      >
        <p>Veuillez sélectionner un organisme dans la barre latérale</p>
      </div>
    );
  }
  return (
    <section
      className={`sticky flex flex-col flex-1 h-[calc(100vh-4rem)] max-h-screen gap-8 p-6 overflow-y-auto top-16 ${
        isDark ? 'bg-gray-900 text-gray-100' : ''
      }`}
    >
      {organism !== null ? (
        <>
          <General />
          <Contacts contacts={organism.contacts} />
          <Informations />
          <Services />
        </>
      ) : (
        <div className="flex flex-col justify-center flex-1 h-full m-auto text-lg text-center item-center text-zinc-600">
          <p>Veuillez sélectionner un organisme dans la barre latérale</p>
        </div>
      )}
    </section>
  );
}
