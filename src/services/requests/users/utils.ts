import { type User } from './types';

export async function getUsersByCompanyIdRequest(
  companyId: string,
  search: string,
  page: string,
  size: string,
  type: string,
) {
  // try {
  //   const clientApi = api;
  //   const response = await clientApi.get(`/users/company/${companyId}`, {
  //     params: {
  //       search,
  //       page,
  //       size,
  //       type,
  //     },
  //   });
  //   return response;
  // } catch (error) {
  //   console.error('Error getUsersByCompanyIdRequest', error);
  //   return null;
  // }
}

export async function updateUserRequest(userId: string, user: Partial<User>) {
  // try {
  //   const clientApi = api;
  //   const response = await clientApi.patch(`/users/${userId}`, {
  //     ...user,
  //   });
  //   return response;
  // } catch (error) {
  //   console.error(
  //     'Erro ao editar usuário, tente novamente mais tarde => ',
  //     error,
  //   );
  //   return null;
  // }
}

export async function getUserByIdRequest(userId: string) {
  // try {
  //   const clientApi = api;
  //   const response = await clientApi.get(`/users/${userId}`);
  //   return response;
  // } catch (error) {
  //   console.error(
  //     'Erro ao buscar usuário, tente novamente mais tarde => ',
  //     error,
  //   );
  //   return null;
  // }
}
