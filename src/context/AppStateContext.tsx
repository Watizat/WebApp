import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Categorie, Days, Organism, Role, Zone } from '../@types/organism';
import { DirectusUser, UserState } from '../@types/user';
import { getUserDataFromLocalStorage } from '../utils/user';

interface AdminState {
  organisms: Organism[];
  organism: Organism | null;
  isLoading: boolean;
  users: DirectusUser[];
  user: DirectusUser | null;
  zones: Zone[];
  zone: Zone | null;
  roles: Role[];
  role: Role | null;
}

interface CrudState {
  isSaving: boolean;
}

interface HamburgerState {
  isOpen: boolean;
}

interface OrganismsState {
  organisms: Organism[];
  filteredOrganisms: Organism[];
  categoryFilter: string[];
  isLoading: boolean;
  categories: Categorie[];
  userPosition: { lat: number; lng: number };
  organism: Organism | null;
  days: Days[];
  langue: number;
  scroll: number;
}

interface AppStateContextValue {
  adminState: AdminState;
  setAdminState: React.Dispatch<React.SetStateAction<AdminState>>;
  crudState: CrudState;
  setCrudState: React.Dispatch<React.SetStateAction<CrudState>>;
  hamburgerState: HamburgerState;
  setHamburgerState: React.Dispatch<React.SetStateAction<HamburgerState>>;
  organismState: OrganismsState;
  setOrganismState: React.Dispatch<React.SetStateAction<OrganismsState>>;
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  resetAppState: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const initialAdminState: AdminState = {
  organisms: [],
  organism: null,
  isLoading: false,
  users: [],
  user: null,
  zones: [],
  zone: null,
  roles: [],
  role: null,
};

const initialCrudState: CrudState = {
  isSaving: false,
};

const initialHamburgerState: HamburgerState = {
  isOpen: false,
};

const initialOrganismsState: OrganismsState = {
  organisms: [],
  filteredOrganisms: [],
  categoryFilter: [],
  isLoading: false,
  categories: [],
  userPosition: { lat: 0, lng: 0 },
  organism: null,
  days: [],
  langue: 1,
  scroll: 1,
};

const timeout = 5 * 1000 * 60;

const createInitialUserState = (): UserState => ({
  loginCredentials: {
    email: '',
    password: '',
  },
  session: null,
  isLogged: false,
  token: null,
  isLoading: false,
  error: null,
  message: null,
  timeout,
  isActive: false,
  lastActionDate: null,
  isRegistered: false,
  ...getUserDataFromLocalStorage(),
  isAdmin: false,
  roleName: null,
  city: localStorage.getItem('city') || null,
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [adminState, setAdminState] = useState<AdminState>(initialAdminState);
  const [crudState, setCrudState] = useState<CrudState>(initialCrudState);
  const [hamburgerState, setHamburgerState] = useState<HamburgerState>(initialHamburgerState);
  const [organismState, setOrganismState] = useState<OrganismsState>(initialOrganismsState);
  const [userState, setUserState] = useState<UserState>(createInitialUserState);
  const resetAppState = useCallback(() => {
    setAdminState(initialAdminState);
    setCrudState(initialCrudState);
    setHamburgerState(initialHamburgerState);
    setOrganismState(initialOrganismsState);
    setUserState(createInitialUserState());
  }, []);

  const contextValue = useMemo<AppStateContextValue>(() => {
    return {
      adminState,
      setAdminState,
      crudState,
      setCrudState,
      hamburgerState,
      setHamburgerState,
      organismState,
      setOrganismState,
      userState,
      setUserState,
      resetAppState,
    };
  }, [
    adminState,
    setAdminState,
    crudState,
    setCrudState,
    hamburgerState,
    setHamburgerState,
    organismState,
    setOrganismState,
    userState,
    setUserState,
    resetAppState,
  ]);

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
}

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within AppStateProvider');
  }
  return context;
};
