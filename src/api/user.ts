import jwt_decode from 'jwt-decode';
import { Inputs } from '../@types/formInputs';
import { AuthResponse, UserSession, UserState } from '../@types/user';
import { axiosInstance } from '../utils/axios';
import { getUserDataFromLocalStorage } from '../utils/user';

export const fetchMe = async () => {
  const { data } = await axiosInstance.get('/users/me');
  return data.data;
};

export const login = async (
  loginCredentials: UserState['loginCredentials']
) => {
  const { data: response } = await axiosInstance.post<{ data: AuthResponse }>(
    '/auth/login',
    loginCredentials
  );
  const { access_token: token } = response.data;
  const session = jwt_decode<UserSession>(token);
  return { token: response.data, session };
};

export const logout = async () => {
  const user = getUserDataFromLocalStorage();

  await axiosInstance.post('/auth/logout', {
    refresh_token: user?.token.refresh_token || null,
  });
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
    role: '5754603f-add3-4823-9c77-a2f9789074fc',
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
