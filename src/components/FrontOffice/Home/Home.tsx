import SearchBox from './SearchBox';
import Infos from './Infos';
import BetaPhase from '../../Modals/BetaPhase';
import { useAppState } from '../../../hooks/appState';

export default function Home() {
  const { themeMode } = useAppState();
  const isDark = themeMode === 'dark';

  return (
    <article className={isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-700'}>
      <div className="flex flex-col gap-20 mt-5 mb-20 lg:mb-0 lg:mt-10 xl:mt-20 lg:gap-20 xl:gap-80 isolate">
        <SearchBox />

        <div className="hidden md:block">
          <Infos />
        </div>
      </div>
      <BetaPhase />
    </article>
  );
}
