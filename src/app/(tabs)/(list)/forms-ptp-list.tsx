import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import { Circle, HStack, Text, useTheme, View, VStack } from 'native-base';
import { useCallback, useState } from 'react';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { type FormPtp } from '@/services/requests/forms-ptp/types';
import { getFormsPtpRequest } from '@/services/requests/forms-ptp/utils';
import { listaUPsOrigem } from '@/utils/listaUPs';
import { tiposEspecificacao } from '@/utils/tiposEspecificacao';

export default function FormsPtpList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [formsPtpList, setFormsPtpList] = useState([] as FormPtp[]);

  async function loadFormsPtp() {
    setLoading(true);
    try {
      const response = await getFormsPtpRequest();

      // console.log(
      //   'getFormsPtpRequest response',
      //   JSON.stringify(response?.data, null, 2),
      // );

      if (response?.status === 200) {
        const formsPtp = response?.data;

        const formsPtpFormatted = formsPtp.map(item => {
          return {
            ...item,
            notaFiscal: item?.notaFiscal || 'N/A',
            opcaoUp:
              listaUPsOrigem?.find(u => u?.value === item?.opcaoUp)?.label ||
              'N/A',
            dataExecucao: dayjs(item?.dataExecucao).format('DD/MM/YYYY'),
          };
        });

        // console.log('formsPtp', formsPtp);

        setFormsPtpList([...formsPtpFormatted]);
      }
    } catch (error) {
      console.error('Error Home loadFormsPtp => ', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadFormsPtp();
    }, []),
  );

  // documentoTransporte,
  // transportador,
  // placa,
  // notaFiscal,
  // dataIdentificacao,
  // conferente,
  // turno,
  // up,
  // arquivos,

  return (
    <ScrollScreenContainer subtitle="Listagem de Formulários PTP">
      {loading ? (
        <Loading mt="80%" />
      ) : (
        <View mb="20%" pt={3}>
          {formsPtpList?.length > 0 ? (
            formsPtpList?.map(item => (
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
                        Data do recebimento
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {item?.dataExecucao as string}
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
                  <Text color="gray.750">Conferente/Técnico</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.conferente}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Nota Fiscal</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.notaFiscal}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">UP Recebimento</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.opcaoUp}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Tipo</Text>
                  <Text color="black" fontWeight="semibold">
                    {
                      tiposEspecificacao?.find(
                        u => u?.value === item?.tipoEspecificacao,
                      )?.label
                    }
                  </Text>
                </VStack>
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
                Nenhum formulário encontrado
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollScreenContainer>
  );
}
