import { api } from '../../api';
import { clearTokensLocalStorage, clearUserLocalStorage } from './helpers';
import { type SignInCredentials } from './types';

export async function signInRequest({ email, password }: SignInCredentials) {
  const response = await api.post('/auth/sign-in', {
    email,
    password,
  });

  if (response?.status === 200) {
    api.defaults.headers.common['Authorization'] =
      `Bearer ${response?.data?.access_token}`;
  }

  return response;
}

export async function signOutRequest() {
  const clientApi = api;

  await clearTokensLocalStorage();

  await clearUserLocalStorage();

  await clientApi.post('/auth/sign-out');
}

export async function forgotPasswordRequest(email: string): Promise<any> {
  const response = await api.post('/auth/refresh', { email });

  return response;
}
