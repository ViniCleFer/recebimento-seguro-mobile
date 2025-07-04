import { supabase } from '@/lib/supabase';
import { type DivergenciaPost } from './types';

export async function getDivergencesRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/divergencias`, {
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
  //   console.error('Error getDivergencesRequest', error);
  //   return null;
  // }
  const { data, error, status } = await supabase
    .from('divergencias')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Error getDivergencesRequest',
      JSON.stringify(error, null, 2),
    );
    // console.error('Error getDivergencesRequest', JSON.stringify(data, null, 2));
    return null;
  }

  return { data, status };
}

export async function getDetailsDivergenceByIdRequest(idDivergencia: string) {
  // const tokens = await getTokensLocalStorage();
  // try {
  //   const response = await api.get(`/divergencias/${idDivergencia}`, {
  //     headers: {
  //       'X-JWT-Auth': tokens['X-JWT-Auth'],
  //       'X-JWT-Refresh': tokens['X-JWT-Refresh'],
  //     },
  //   });
  //   return response;
  // } catch (error) {
  //   console.error('Error getDivergencesRequest', error);
  //   return null;
  // }
  const { data, error, status, statusText, count } = await supabase
    .from('divergencias')
    .select()
    .eq('id', idDivergencia);

  if (error) {
    console.error(
      'Error getDetailsDivergenceByIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getDetailsDivergenceByIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getDetailsDivergenceByIdRequest',
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

export async function createDivergenceRequest(divergenciaPostData: any) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/divergencias`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;
  const { error, data, status, statusText, count } = await supabase
    .from('divergencias')
    .insert(divergenciaPostData)
    .select();

  if (error) {
    console.error(
      'Error createDivergenceRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error createDivergenceRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }
  console.log(
    'Success createDivergenceRequest',
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
