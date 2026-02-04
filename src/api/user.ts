import jwt_decode from 'jwt-decode';
import { Inputs } from '../@types/formInputs';
import { AuthResponse, DirectusUser, UserSession, UserState } from '../@types/user';
import { axiosInstance } from '../utils/axios';
import { getUserDataFromLocalStorage } from '../utils/user';

let meCache: DirectusUser | null = null;
let mePromise: Promise<DirectusUser | null> | null = null;

export const clearMeCache = () => {
  meCache = null;
  mePromise = null;
};

export const fetchMe = async (options?: { force?: boolean }) => {
  if (!options?.force && meCache) {
    return meCache;
  }
  if (!options?.force && mePromise) {
    return mePromise;
  }
  mePromise = axiosInstance
    .get('/users/me', {
      params: {
        fields: '*,role.name',
      },
    })
    .then(({ data }) => {
      meCache = data.data;
      return meCache;
    })
    .finally(() => {
      mePromise = null;
    });
  return mePromise;
};

export const login = async (loginCredentials: UserState['loginCredentials']) => {
  const { data: response } = await axiosInstance.post<{ data: AuthResponse }>('/auth/login', loginCredentials);
  const { access_token: token } = response.data;
  const session = jwt_decode<UserSession>(token);
  return { token: response.data, session };
};

export const logout = async () => {
  const user = getUserDataFromLocalStorage();

  try {
    await axiosInstance.post('/auth/logout', {
      refresh_token: user?.token.refresh_token || null,
    });
  } finally {
    clearMeCache();
  }
};

export const askPassword = async (email: string) => {
  await axiosInstance.post('/auth/password/request', {
    email,
    reset_url: 'https://guide.watizat.app/recover-password',
  });
};

export const registerUser = async (formData: Inputs) => {
  await axiosInstance.post('/users', {
    ...formData,
  });
};

export const editUser = async (formData: Inputs) => {
  await axiosInstance.patch(`/users/${formData.id}`, {
    ...formData,
  });
};

export const updateUserStatus = async (userId: string, status: string) => {
  await axiosInstance.patch(`/users/${userId}`, {
    status,
  });
};
