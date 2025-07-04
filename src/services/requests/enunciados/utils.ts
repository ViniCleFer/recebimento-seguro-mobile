import { supabase } from '@/lib/supabase';
import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { EnunciadoPut, type EnunciadoPost } from './types';
import { QueryData } from '@supabase/supabase-js';

export async function getEnunciadosRequest(
  // axiosAuth: any,
  search = '',
  ativo = 'ativo',
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  // const response = await axiosAuth.get(`/enunciados`, {
  //   params: {
  //     search,
  //     ativo,
  //     page,
  //     size,
  //   },
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // console.log('response', JSON.stringify(response, null, 2));

  // return response;
  const { data, error } = await supabase
    .from('enunciados')
    .select()
    .eq('ativo', 'true')
    .order('grupo', { ascending: false })
    .order('posicao', { ascending: true });
  if (error) {
    console.error('Error createFormPtpRequest', JSON.stringify(error, null, 2));
    console.error('Error createFormPtpRequest', JSON.stringify(data, null, 2));
    return null;
  }

  return data;
  // } catch (error) {
  //   console.error('Error getEnunciadosRequest', error);
  //   return null;
  // }
}

export async function getDetailsEnunciadoRequest(idEnunciado: string) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/enunciados/${idEnunciado}`, {
  //     headers: {
  //       Authorization: `Bearer ${tokens['access_token']}`,
  //       userId: user?.id,
  //     },
  //   });

  //   return response;
  // } catch (error) {
  //   console.error('Error getDetailsEnunciadoRequest', error);
  //   return null;
  // }

  const { data, error, status, statusText, count } = await supabase
    .from('enunciados')
    .select()
    .eq('id', idEnunciado);

  if (error) {
    console.error(
      'Error getDetailsEnunciadoRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getDetailsEnunciadoRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getDetailsEnunciadoRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}

export async function createEnunciadoRequest() {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/enunciados`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  const { error, data } = await supabase.from('enunciados').insert({
    id: '02000606-d328-4908-ac23-111fb651b873',
    descricao:
      'Data de Validade correta legível e dentro do prazo comercial\nProdutos com validade de 6 meses podem ser expedidos com 4 meses, Produtos com validade de 12 meses podem ser expedidos com 8 meses, Produtos com validade de 24 meses podem ser expedidos com 16 meses.',
    posicao: 6,
    ativo: true,
    grupo: 'CAIXA_E_FARDO',
  });

  if (error) {
    console.error('Error createEnunciadoRequest', error);
    return null;
  }
  return data;
}

export async function updateEnunciadoRequest(data: EnunciadoPut) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  const response = await api.post(`/enunciados/${data?.id}`, data, {
    headers: {
      Authorization: `Bearer ${tokens['access_token']}`,
      userId: user?.id,
    },
  });

  return response;
}
