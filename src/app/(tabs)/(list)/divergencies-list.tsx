import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Box, Circle, HStack, Text, useTheme, View, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  Divergencia,
  TipoDivergencia,
} from '@/services/requests/divergences/types';
import { getDivergencesRequest } from '@/services/requests/divergences/utils';

import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';

export default function DivergenciesList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [divergenciesList, setDivergenciesList] = useState([] as Divergencia[]);

  async function loadDivergencies() {
    setLoading(true);
    try {
      const response = await getDivergencesRequest();

      if (response?.status === 200) {
        let divergencias: any[] = [];

        if (response?.data?.length > 0) {
          for await (const divergencia of response?.data) {
            // const evidencias = divergencia?.evidencias;

            let evidenciasDownload: any[] = [];

            // if (evidencias?.length === 0) {
            //   evidenciasDownload = [];
            // } else {
            //   for await (const evidenciaId of evidencias) {
            //     const { data } = supabase.storage
            //       .from('evidencias')
            //       .getPublicUrl(
            //         `divergencia/${divergencia?.id}/${evidenciaId}`,
            //       );

            //     const evidencia = data?.publicUrl;

            //     if (evidencia) {
            //       evidenciasDownload = [...evidenciasDownload, evidencia];
            //     } else {
            //       evidenciasDownload = [...evidenciasDownload];
            //     }
            //   }
            // }

            const upOrigem = listaUPsOrigem?.find(
              u => u?.value === divergencia?.upOrigem,
            )?.label;
            const cdOrigem = listaCDsOrigem?.find(
              u => u?.value === divergencia?.cdOrigem,
            )?.label;

            divergencias = [
              ...divergencias,
              {
                ...divergencia,
                upOrigem: upOrigem || 'N/A',
                cdOrigem: cdOrigem || 'N/A',
                evidencias: [],
                // evidencias: [...evidenciasDownload],
              },
            ];
          }

          setDivergenciesList([...divergencias]);
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
    <ScrollScreenContainer subtitle="Listagem de Divergências">
      {loading ? (
        <Loading mt="80%" />
      ) : (
        <View mb="20%" pt={3}>
          {divergenciesList?.length > 0 ? (
            divergenciesList?.map(item => (
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
                        Data de Recebimento
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {dayjs(item?.created_at).format('DD/MM/YYYY')}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Tipo da Divergência</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.tipoDivergencia}
                  </Text>
                </VStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Nota Fiscal</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.notaFiscal}
                  </Text>
                </VStack>

                {item?.tipoDivergencia === TipoDivergencia.FALTA && (
                  <>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">Sku Faltando Fisicamente</Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.skuFaltandoFisicamente}
                      </Text>
                    </VStack>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">
                        Quantidade Faltando Fisicamente
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.qtdFaltandoFisicamente}
                      </Text>
                    </VStack>
                  </>
                )}

                {item?.tipoDivergencia === TipoDivergencia.SOBRA && (
                  <>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">Sku Sobrando Fisicamente</Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.skuSobrandoFisicamente}
                      </Text>
                    </VStack>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">
                        Quantidade Sobrando Fisicamente
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.qtdSobrandoFisicamente}
                      </Text>
                    </VStack>
                  </>
                )}

                {item?.tipoDivergencia === TipoDivergencia.INVERSAO && (
                  <>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">Sku Recebemos Fisicamente</Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.skuRecebemosFisicamente}
                      </Text>
                    </VStack>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">
                        Quantidade Recebemos Fisicamente
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.qtdRecebemosFisicamente}
                      </Text>
                    </VStack>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">Nota Fiscal SKU</Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.skuNotaFiscal}
                      </Text>
                    </VStack>
                    <VStack pl={2} mb={4}>
                      <Text color="gray.750">Quantidade Nota Fiscal</Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.qtdNotaFiscal}
                      </Text>
                    </VStack>
                  </>
                )}

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Próximos passos</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.proximoPasso}
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

                {/* <VStack pl={2} mb={4} width="100%">
                  <Text color="gray.750">Evidências</Text>
                  {item?.evidencias?.length > 0 ? (
                    <Box style={{ gap: 8 }}>
                      {item?.evidencias?.map((item: any, index) => (
                        <Image
                          key={index}
                          source={{ uri: item }}
                          alt="image"
                          contentFit="fill"
                          transition={1000}
                          style={{ width: 80, height: 80 }}
                        />
                      ))}
                    </Box>
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
                Nenhuma divergência encontrada
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollScreenContainer>
  );
}
