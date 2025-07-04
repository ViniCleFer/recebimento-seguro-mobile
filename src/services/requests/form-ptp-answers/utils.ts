import { supabase } from '@/lib/supabase';
import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type FormPtpAnswerPost } from './types';

export async function getFormPtpAnswersRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/forms-ptp-answers`, {
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
  const { data, error, status } = await supabase
    .from('forms-ptp-answers')
    .select();

  if (error) {
    console.error(
      'Error getFormPtpAnswersRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getFormPtpAnswersRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  return { data, status };
}

export async function getFormsPtpAnswerByFormPtpIdRequest(idFormPtp: string) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/forms-ptp-answers/form-ptp`, {
  //     headers: {
  //       Authorization: `Bearer ${tokens['access_token']}`,
  //       userId: user?.id,
  //       id: idFormPtp,
  //     },
  //   });

  //   return response;
  // } catch (error) {
  //   console.error('Error getFormsPtpRequest', error);
  //   return null;
  // }
  const { data, error, status, statusText, count } = await supabase
    .from('forms-ptp-answers')
    .select()
    .eq('form_ptp_id', idFormPtp);

  if (error) {
    console.error(
      'Error getFormsPtpAnswerByFormPtpIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getFormsPtpAnswerByFormPtpIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getFormsPtpAnswerByFormPtpIdRequest',
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

export async function getFormPtpAnswerByIdRequest(idAnswerFormPtp: string) {
  const { data, error, status, statusText, count } = await supabase
    .from('forms-ptp-answers')
    .select()
    .eq('id', idAnswerFormPtp);

  if (error) {
    console.error(
      'Error getFormPtpAnswerByIdRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error getFormPtpAnswerByIdRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  console.log(
    'Success getFormPtpAnswerByIdRequest',
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

export async function createFormPtpAnswerRequest(
  formPtpAnswerPostData: FormPtpAnswerPost,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/forms-ptp-answers`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;

  const { error, data, status, statusText, count } = await supabase
    .from('forms-ptp-answers')
    .insert(formPtpAnswerPostData)
    .select();

  if (error) {
    console.error(
      'Error createFormPtpAnswerRequest',
      JSON.stringify(error, null, 2),
    );
    console.error(
      'Error createFormPtpAnswerRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }
  console.log(
    'Success createFormPtpAnswerRequest',
    JSON.stringify(
      {
        data,
        status,
      },
      null,
      2,
    ),
  );

  return { data, status };
}
