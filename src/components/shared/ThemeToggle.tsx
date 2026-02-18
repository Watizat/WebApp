import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useAppState } from '../../hooks/appState';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className = '' }: Props) {
  const { themeMode, toggleThemeMode } = useAppState();
  const isDark = themeMode === 'dark';

  return (
    <button
      type='button'
      onClick={toggleThemeMode}
      className={`inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? <SunIcon className='h-5 w-5' /> : <MoonIcon className='h-5 w-5 text-yellow-500' />}
    </button>
  );
}
