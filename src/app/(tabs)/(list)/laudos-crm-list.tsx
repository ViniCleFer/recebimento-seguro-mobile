import { useCallback, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import { Circle, HStack, Text, useTheme, View, VStack } from 'native-base';
// import { Image } from 'expo-image';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { LaudoCrmWithAnswer } from '@/services/requests/laudos/types';
import { getLaudosCrmRequest } from '@/services/requests/laudos/utils';

import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';
import { tiposNaoConformidade as tiposNaoConformidadeList } from '@/utils/tiposNaoConformidade';

export default function LuadoCrmList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [laudosCrmList, setLaudosCrmList] = useState<LaudoCrmWithAnswer[]>([]);

  async function loadDivergencies() {
    setLoading(true);
    try {
      const response = await getLaudosCrmRequest();

      if (response?.status === 200) {
        let laudosCrm: any[] = [];

        if (response?.data?.length > 0) {
          for await (const laudoCrm of response?.data as any[]) {
            // const evidencias = laudoCrm?.evidencias;

            // let urlsEvidencias: any[] = [];

            // if (evidencias?.length === 0) {
            //   urlsEvidencias = [];
            // } else {
            //   for await (const evidenciaId of evidencias) {
            //     const { data } = supabase.storage
            //       .from('evidencias')
            //       .getPublicUrl(`laudoCrm/${laudoCrm?.id}/${evidenciaId}`);

            //     const evidencia = data?.publicUrl;

            //     if (evidencia) {
            //       urlsEvidencias = [...urlsEvidencias, evidencia];
            //     } else {
            //       urlsEvidencias = [...urlsEvidencias];
            //     }
            //   }
            // }

            laudosCrm = [
              ...laudosCrm,
              {
                ...laudoCrm,
                evidencias: [],
                // evidencias: [...urlsEvidencias],
              },
            ];
          }

          const tiposNaoConformidadeFormatted = laudosCrm.map(laudo => {
            const tiposNaoConformidade = laudo?.tiposNaoConformidade;
            const lotes = laudo?.lotes;
            const codigosProdutos = laudo?.codigoProdutos;
            const qtdCaixasNaoConformes = laudo?.qtdCaixasNaoConformes;

            let tiposNaoConformidadeFormatted = '';

            if (tiposNaoConformidade?.length > 0) {
              tiposNaoConformidadeFormatted = tiposNaoConformidade
                .map(
                  (tipo: string) =>
                    '- ' +
                    tiposNaoConformidadeList?.find(item => item?.value === tipo)
                      ?.label,
                )
                .join('\n');
            } else {
              tiposNaoConformidadeFormatted = 'Sem tipos de não conformidade';
            }

            let lotesFormatted = '';

            if (lotes?.length > 0) {
              lotesFormatted = lotes
                .map((lote: string) => '- ' + lote?.trim())
                .join('\n');
            } else {
              lotesFormatted = 'Sem lotes cadastrados';
            }

            let codigosProdutosFormatted = '';

            if (codigosProdutos?.length > 0) {
              codigosProdutosFormatted = codigosProdutos
                .map((codigoProduto: string) => '- ' + codigoProduto?.trim())
                .join('\n');
            } else {
              codigosProdutosFormatted = 'Sem códigos de produtos cadastrados';
            }

            let qtdCaixasNaoConformesFormatted = '';

            if (qtdCaixasNaoConformes?.length > 0) {
              qtdCaixasNaoConformesFormatted = qtdCaixasNaoConformes
                .map(
                  (qtdCaixasNaoConforme: string) =>
                    '- ' + qtdCaixasNaoConforme?.trim(),
                )
                .join('\n');
            } else {
              qtdCaixasNaoConformesFormatted =
                'Sem códigos de produtos cadastrados';
            }

            const upOrigem = listaUPsOrigem?.find(
              u => u?.value === laudo?.upOrigem,
            )?.label;
            const cdOrigem = listaCDsOrigem?.find(
              u => u?.value === laudo?.cdOrigem,
            )?.label;

            return {
              ...laudo,
              upOrigem: upOrigem || 'Sem UP de Origem',
              cdOrigem: cdOrigem || 'Sem CD de Origem',
              observacoes: laudo?.observacoes || 'Sem observações',
              tiposNaoConformidade: tiposNaoConformidadeFormatted,
              lotes: lotesFormatted,
              codigosProdutos: codigosProdutosFormatted,
              qtdCaixasNaoConformes: qtdCaixasNaoConformesFormatted,
            };
          });

          console.log('laudosCrm => ', JSON.stringify(laudosCrm, null, 2));

          setLaudosCrmList([...tiposNaoConformidadeFormatted]);
        }
      }
    } catch (error) {
      console.error('Error Home loadDivergencies => ', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadDivergencies();
    }, []),
  );

  return (
    <ScrollScreenContainer subtitle="Listagem de Laudos CRM">
      {loading ? (
        <Loading mt="80%" />
      ) : (
        <View mb="20%" pt={3}>
          {laudosCrmList?.length > 0 ? (
            laudosCrmList?.map(item => (
              <Card key={item?.id} p={4} borderRadius="4" mb={4}>
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  mb={4}
                >
                  <HStack alignItems="center">
                    <Circle bg="primary.700" h={12} w={12}>
                      <MaterialIcons
                        name="calendar-month"
                        size={24}
                        color={colors.white}
                      />
                    </Circle>

                    <VStack ml={3}>
                      <Text color="gray.750" w="100%">
                        Data de Transporte
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {dayjs(item?.dataIdentificacao).format('DD/MM/YYYY')}
                      </Text>
                    </VStack>
                  </HStack>

                  {/* <VStack>
                  <Text color="gray.750">Evento Nº</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.idEvento || 'Sem número'}
                  </Text>
                </VStack> */}
                </HStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Transportador</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.transportador}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Remessa</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.remessa}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Placa</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.placa}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Nota Fiscal</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.notaFiscal}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Conferente/Técnico</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.conferente}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Turno</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.turno}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">UP de Origem</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.upOrigem}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">CD de Origem</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.cdOrigem}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Tipos de Não Conformidade</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.tiposNaoConformidade}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Lotes não conformes</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.lotes}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">
                    Códigos dos produtos não conformes
                  </Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.codigosProdutos}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Qtd. Caixas não conformes</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.qtdCaixasNaoConformes}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Observações Gerais</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.observacoes}
                  </Text>
                </VStack>
                {/* <VStack pl={2} mb={4} width="100%">
                  <Text color="gray.750">Evidências</Text>
                  {item?.evidencias?.length > 0 ? (
                    item?.evidencias?.map((item: any, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: item }}
                        alt="image"
                        contentFit="fill"
                        transition={1000}
                        style={{ width: 80, height: 60 }}
                      />
                    ))
                  ) : (
                    <Text color="black" fontWeight="semibold">
                      Sem evidências
                    </Text>
                  )}
                </VStack> */}
              </Card>
            ))
          ) : (
            <View mt="70%" justifyContent="center" alignItems="center">
              <Text
                color="gray.750"
                fontSize="lg"
                textAlign="center"
                justifyContent={'center'}
              >
                Nenhum laudo encontrado
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollScreenContainer>
  );
}
