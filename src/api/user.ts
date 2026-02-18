import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Inputs } from '../@types/formInputs';
import { AuthResponse, DirectusUser, UserSession, UserState } from '../@types/user';
import { axiosInstance } from '../utils/axios';
import { getUserDataFromLocalStorage } from '../utils/user';
const API_URL = import.meta.env.VITE_API_URL;
const APP_URL = import.meta.env.VITE_APP_URL;

let meCache: DirectusUser | null = null;
let mePromise: Promise<DirectusUser | null> | null = null;
let meCacheVersion = 0;

export const clearMeCache = () => {
  meCacheVersion += 1;
  meCache = null;
  mePromise = null;
};

export const fetchMe = async (options?: { force?: boolean }) => {
  const requestVersion = meCacheVersion;
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
        ...(options?.force ? { _cb: Date.now() } : {}),
      },
    })
    .then(({ data }) => {
      if (requestVersion !== meCacheVersion) {
        return null;
      }
      meCache = data.data;
      return meCache;
    })
    .finally(() => {
      if (requestVersion === meCacheVersion) {
        mePromise = null;
      }
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
  const fallbackAppUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const resetUrlBase = APP_URL || fallbackAppUrl;

  await axiosInstance.post('/auth/password/request', {
    email,
    reset_url: `${resetUrlBase}/recover-password`,
  });
};

export const registerUser = async (formData: Inputs) => {
  const payload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    password: formData.password,
    ...(formData.zone ? { zone: formData.zone } : {}),
  };

  try {
    await axios.post(`${API_URL}/users`, payload);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 403 &&
      JSON.stringify(error.response?.data || {}).includes('"zone"')
    ) {
      const { zone, ...payloadWithoutZone } = payload;
      await axios.post(`${API_URL}/users`, payloadWithoutZone);
      return;
    }
    throw error;
  }
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
