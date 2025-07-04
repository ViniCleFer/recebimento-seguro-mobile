import { supabase } from '@/lib/supabase';
import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type FormPtpPost } from './types';

export async function getFormsPtpRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/forms-ptp`, {
  //     params: {
  //       search: '',
  //       page,
  //       size,
  //     },
  //     headers: {
  //       Authorization: `Bearer ${tokens['access_token']}`,
  //       userId: user?.id,
  //     },
  //   });

  //   return response;
  // } catch (error) {
  //   console.error('Error getFormsPtpRequest', error);
  //   return null;
  // }
  const { data, error, status, statusText, count } = await supabase
    .from('forms-ptp')
    .select()
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error getFormsPtpRequest', JSON.stringify(error, null, 2));
    console.error('Error getFormsPtpRequest', JSON.stringify(data, null, 2));
    return null;
  }

  console.log(
    'Success getFormsPtpRequest',
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

export async function getDetailsFormPtpByIdRequest(idFormPtp: string) {
  // const tokens = await getTokensLocalStorage();
  // try {
  //   const response = await api.get(`/forms-ptp/${idFormPtp}`, {
  //     headers: {
  //       'X-JWT-Auth': tokens['X-JWT-Auth'],
  //       'X-JWT-Refresh': tokens['X-JWT-Refresh'],
  //     },
  //   });
  //   return response;
  // } catch (error) {
  //   console.error('Error getFormsPtpRequest', error);
  //   return null;
  // }
  const { data, error, status, statusText, count } = await supabase
    .from('forms-ptp')
    .select()
    .eq('id', idFormPtp);

  if (error) {
    console.error(
      'Error getDetailsFormPtpByIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getDetailsFormPtpByIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getDetailsFormPtpByIdRequest',
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

export async function createFormPtpRequest(formPtpData: FormPtpPost) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/forms-ptp`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;
  const { error, data, status, statusText, count } = await supabase
    .from('forms-ptp')
    .insert(formPtpData)
    .select();

  if (error) {
    console.error('Error createFormPtpRequest', JSON.stringify(error, null, 2));
    console.error('Error createFormPtpRequest', JSON.stringify(data, null, 2));
    return null;
  }
  console.log(
    'Success createFormPtpRequest',
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
