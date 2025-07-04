import React from 'react';
import { useCallback, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import {
  Button,
  Circle,
  HStack,
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  CartaControle,
  TipoEvidenciaCartaControle,
} from '@/services/requests/cartas-controle/types';
import {
  finishCartaControleRequest,
  getCartasControleRequest,
} from '@/services/requests/cartas-controle/utils';

import { listaTurnos } from '@/utils/listaTurnos';
import { Alert } from 'react-native';
import { Backdrop } from '@/components/Backdrop';

export default function CartaControleList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [cartasControleList, setCartasControleList] = useState<CartaControle[]>(
    [],
  );

  async function loadCartasControle() {
    setLoading(true);
    try {
      const response = await getCartasControleRequest();

      if (response?.status === 200 && response?.data?.length > 0) {
        const cartasControleFormatted = response?.data.map(item => {
          const turno = listaTurnos?.find(
            turno => turno?.value === item?.turno,
          )?.label;

          return {
            ...item,
            turno,
          };
        });

        setCartasControleList([...cartasControleFormatted]);
      }
    } catch (error) {
      console.error('Error Home loadCartasControle => ', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadCartasControle();
    }, []),
  );

  async function handleFinish(id: string) {
    setLoading(true);
    try {
      const response = await finishCartaControleRequest(id);

      if (response?.status === 200) {
        loadCartasControle();
      }
    } catch (error) {
      console.error('Error Home loadCartasControle => ', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFinishCartaControle = useCallback(
    (cartaControle: CartaControle) => {
      setLoading(true);

      const {
        dataIdentificacao,
        turno,
        documentoTransporte,
        remessa,
        conferente,
        doca,
        capacidadeVeiculo,
        evidencias,
      } = cartaControle;

      const imagesList = evidencias?.map(item => {
        const type = item?.split('/')[0];

        return {
          type,
          uri: item,
        };
      });

      const imagesListCargaDoca = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.CARGA_DOCA,
      );
      const imagesListOrdemCarregamento = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
      );
      const imagesListInicioCarregamento = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
      );
      const imagesListMeioCarregamento = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
      );
      const imagesListFimCarregamento = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
      );
      const imagesListPlacaVeiculo = imagesList?.filter(
        i => i?.type === TipoEvidenciaCartaControle.PLACA_VEICULO,
      );

      // console.log(
      //   'imagesListCargaDoca',
      //   JSON.stringify(imagesListCargaDoca?.length, null, 2),
      // );
      // console.log(
      //   'imagesListOrdemCarregamento',
      //   JSON.stringify(imagesListOrdemCarregamento?.length, null, 2),
      // );
      // console.log(
      //   'imagesListInicioCarregamento',
      //   JSON.stringify(imagesListInicioCarregamento?.length, null, 2),
      // );
      // console.log(
      //   'imagesListMeioCarregamento',
      //   JSON.stringify(imagesListMeioCarregamento?.length, null, 2),
      // );
      // console.log(
      //   'imagesListFimCarregamento',
      //   JSON.stringify(imagesListFimCarregamento?.length, null, 2),
      // );
      // console.log(
      //   'imagesListPlacaVeiculo',
      //   JSON.stringify(imagesListPlacaVeiculo?.length, null, 2),
      // );
      // console.log('dataIdentificacao', dataIdentificacao);
      // console.log('turno', turno);
      // console.log('documentoTransporte', documentoTransporte);
      // console.log('remessa', remessa);
      // console.log('conferente', conferente);
      // console.log('doca', doca);
      // console.log('capacidadeVeiculo', capacidadeVeiculo);
      // console.log('evidencias', evidencias);

      if (
        imagesListCargaDoca?.length === 0 ||
        imagesListOrdemCarregamento?.length === 0 ||
        imagesListInicioCarregamento?.length === 0 ||
        imagesListMeioCarregamento?.length === 0 ||
        imagesListFimCarregamento?.length === 0 ||
        imagesListPlacaVeiculo?.length === 0 ||
        !dataIdentificacao ||
        !turno ||
        !documentoTransporte ||
        !remessa ||
        !conferente ||
        !doca ||
        !capacidadeVeiculo
      ) {
        setLoading(false);
        return Alert.alert(
          'Carta Controle',
          'Por favor, para finalizar você precisa preencher todos os campos da Carta Controle.',
        );
      }

      Alert.alert(
        'Finalizar Carta de Controle',
        'Você tem certeza que deseja finalizar a carta de controle?',
        [
          {
            text: 'Cancelar',
            onPress: () => setLoading(false),
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => handleFinish(cartaControle?.id),
            style: 'default',
          },
        ],
      );
    },
    [handleFinish],
  );

  return (
    <>
      {loading && <Backdrop visible={loading} color={colors.primary[700]} />}
      <ScrollScreenContainer subtitle="Listagem de Cartas Controle">
        <View mb="20%" pt={3}>
          {cartasControleList?.length > 0 ? (
            cartasControleList?.map(item => (
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
                        {dayjs(item?.dataIdentificacao).format('DD/MM/YYYY')}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack alignItems="center" space={2}>
                    {item.status === 'EM_ANDAMENTO' && (
                      <Button
                        variant="outline"
                        colorScheme="primary"
                        onPress={() =>
                          router.navigate(`/carta-controle/edit/${item?.id}`)
                        }
                      >
                        <MaterialIcons
                          name="edit"
                          size={20}
                          color={colors.primary[700]}
                        />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      colorScheme="primary"
                      onPress={() => handleFinishCartaControle(item)}
                      disabled={item?.status === 'FINALIZADO'}
                    >
                      <MaterialIcons
                        name="check"
                        size={20}
                        color={
                          item?.status === 'FINALIZADO'
                            ? colors.primary[700]
                            : colors.green[700]
                        }
                      />
                    </Button>
                  </HStack>
                </HStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Turno</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.turno}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Documento Transporte (DT)</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.documentoTransporte}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Remessa</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.remessa}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Conferente/Técnico</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.conferente}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Doca</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.doca}
                  </Text>
                </VStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Capacidade Veículo</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.capacidadeVeiculo}
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
                Nenhuma carta de controle encontrada
              </Text>
            </View>
          )}
        </View>
      </ScrollScreenContainer>
    </>
  );
}
