import { supabase } from '@/lib/supabase';
import { CartaControlePut, type CartaControlePost } from './types';
import { listaTurnos } from '@/helpers/listaTurnos';
import { groupImagesByType } from '@/utils/groupImagesByType';

export async function getCartasControleRequest(
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
    .from('cartas-controle')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Error getCartasControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  return { data, status };
}

export async function getCartasControleByIdRequest(cartaControleId: string) {
  const { data, error, status, statusText, count } = await supabase
    .from('cartas-controle')
    .select()
    .eq('id', cartaControleId);

  if (error) {
    console.error(
      'Error getCartasControleByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getCartasControleByIdRequest',
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

export async function getCartaControleEvidencesRequest(
  cartaControleId: string,
  evidenciaId: string,
) {
  const { data } = supabase.storage
    .from('evidencias')
    .getPublicUrl(`carta-controle/${cartaControleId}/${evidenciaId}`);

  return { data };
}

export async function getCartasControleWithEvidencesByIdRequest(
  cartaControleId: string,
) {
  const { data, error, status, statusText, count } = await supabase
    .from('cartas-controle')
    .select(
      `
    *,
    users:users(*)
  `,
    )
    .eq('id', cartaControleId);

  if (error) {
    console.error(
      'Error getCartasControleByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  if (status === 200) {
    let cartasControle: any[] = [];

    if (data?.length === 1) {
      for await (const cartaControle of data as any[]) {
        const evidencias = cartaControle?.evidencias;

        let urlsEvidencias: any[] = [];

        if (evidencias?.length === 0) {
          urlsEvidencias = [];
        } else {
          for await (const evidenciaId of evidencias) {
            const { data } = await getCartaControleEvidencesRequest(
              cartaControle?.id,
              evidenciaId,
            );

            const evidencia = data?.publicUrl;

            if (evidencia) {
              const grupo = evidenciaId.split('/')[0];

              urlsEvidencias = [
                ...urlsEvidencias,
                { url: evidencia, tipo: evidenciaId, grupo },
              ];
            } else {
              urlsEvidencias = [...urlsEvidencias];
            }
          }
        }

        cartasControle = [
          ...cartasControle,
          {
            ...cartaControle,
            evidencias: [...urlsEvidencias],
          },
        ];
      }

      const cartaControleFormatada = cartasControle?.map(cartaControle => {
        const turno = listaTurnos?.find(
          u => u?.value === cartaControle?.turno,
        )?.label;

        const evidencias = groupImagesByType(cartaControle?.evidencias);

        return {
          ...cartaControle,
          turno: turno,
          evidencias,
        };
      });

      console.log(
        'cartaControleFormatada => ',
        JSON.stringify(cartaControleFormatada[0], null, 2),
      );

      return { data: cartaControleFormatada, status };
    }
  }

  console.log(
    'Success getCartasControleByIdRequest',
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

export async function createCartaControleRequest(
  cartaControleData: CartaControlePost,
) {
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
    .from('cartas-controle')
    .insert(cartaControleData)
    .select();

  if (error) {
    console.error(
      'Error createCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success createCartaControleRequest',
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

export async function updateCartaControleRequest(
  cartaControleData: CartaControlePut,
  cartaControleId: string,
) {
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
    .from('cartas-controle')
    .update(cartaControleData)
    .eq('id', cartaControleId)
    .select();

  if (error) {
    console.error(
      'Error updateCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success updateCartaControleRequest',
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

export async function finishCartaControleRequest(cartaControleId: string) {
  const { error, data, status, statusText, count } = await supabase
    .from('cartas-controle')
    .update({ status: 'FINALIZADO' })
    .eq('id', cartaControleId)
    .select();

  if (error) {
    console.error(
      'Error finishCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success finishCartaControleRequest',
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

export async function updateEvidenciasCartaControleRequest(
  cartaControleId: string,
  evidencias: string[],
) {
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
    .from('cartas-controle')
    .update({
      evidencias: [...evidencias],
    })
    .eq('id', cartaControleId)
    .select();

  if (error) {
    console.error(
      'Error updateEvidenciasCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success updateEvidenciasCartaControleRequest',
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
