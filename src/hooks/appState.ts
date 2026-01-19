import { useAppStateContext } from '../context/AppStateContext';

export const useAppState = () => {
  return useAppStateContext();
};
