import axios from 'axios';

import {
  clearTokensLocalStorage,
  clearUserLocalStorage,
} from '../requests/auth/helpers';

const apiConnection = axios.create({
  // baseURL: 'http://localhost:3333',
  baseURL: 'http://localhost:8888',
});

// apiConnection.interceptors.response.use(
//   response => {
//     // Se a resposta for bem-sucedida, retorna os dados
//     return response;
//   },
//   error => {
//     // Se ocorrer um erro, verifica se o status é 401
//     console.log('DEU RIUIM', error);
//     if (error.response && error.response.status === 401) {
//       clearUserLocalStorage();
//       clearTokensLocalStorage();
//     }
//     // Rejeita a promessa com o erro para que seja tratado nos componentes
//     return Promise.reject(error);
//   },
// );

export const api = apiConnection;
