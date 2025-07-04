import { supabase } from '@/lib/supabase';
import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type LaudoCrmPost } from './types';

export async function getLaudosCrmRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/laudos-crm`, {
  //     params: {
  //       search,
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
  const { data, error, status } = await supabase
    .from('laudos-crm')
    .select(
      `
    *,
    forms-ptp:forms-ptp(*)
  `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getLaudosCrmRequest', JSON.stringify(error, null, 2));
    console.error('Error getLaudosCrmRequest', JSON.stringify(data, null, 2));
    return null;
  }

  return { data, status };
}

export async function getLaudosCrmByFormPtpIdRequest(
  idFormPtp: string,
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();

  // try {
  //   const response = await api.get(`/laudos-crm/ptp/${idFormPtp}`, {
  //     params: {
  //       search,
  //       page,
  //       size,
  //     },
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
    .from('laudos-crm')
    .select()
    .eq('form-ptp-id', idFormPtp);

  if (error) {
    console.error(
      'Error getLaudosCrmByFormPtpIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getLaudosCrmByFormPtpIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getLaudosCrmByFormPtpIdRequest',
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

export async function getLaudosCrmByIdRequest(laudoCrmId: string) {
  const { data, error, status, statusText, count } = await supabase
    .from('laudos-crm')
    .select()
    .eq('id', laudoCrmId);

  if (error) {
    console.error(
      'Error getLaudosCrmByIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getLaudosCrmByIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getLaudosCrmByIdRequest',
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

export async function createLaudoCrmRequest(laudoCrmData: LaudoCrmPost) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/laudos-crm`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;
  const { error, data, status, statusText, count } = await supabase
    .from('laudos-crm')
    .insert(laudoCrmData)
    .select();

  if (error) {
    console.error(
      'Error createLaudoCrmRequest',
      JSON.stringify(error, null, 2),
    );
    console.error('Error createLaudoCrmRequest', JSON.stringify(data, null, 2));
    return null;
  }
  console.log(
    'Success createLaudoCrmRequest',
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
