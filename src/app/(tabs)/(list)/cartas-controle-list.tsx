import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  CartaControle,
  TipoEvidenciaCartaControle,
} from '@/services/requests/cartas-controle/types';
import {
  finishCartaControleRequest,
  getCartasControleRequest,
} from '@/services/requests/cartas-controle/utils';

import { Backdrop } from '@/components/Backdrop';
import { listaTurnos } from '@/utils/listaTurnos';

export default function CartaControleList() {
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

  const handleFinish = useCallback(async (id: string) => {
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
  }, []);

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
      {loading && <Backdrop visible={loading} color="#084077" />}
      <ScrollScreenContainer subtitle="Listagem de Cartas Controle">
        <View style={styles.container}>
          {cartasControleList?.length > 0 ? (
            cartasControleList?.map(item => (
              <Card key={item?.id} style={styles.card}>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={styles.circle}>
                      <MaterialIcons
                        name="calendar-month"
                        size={24}
                        color="#ffffff"
                      />
                    </View>

                    <View style={styles.headerInfo}>
                      <Text style={styles.label}>Data de Recebimento</Text>
                      <Text style={styles.value}>
                        {dayjs(item?.dataIdentificacao).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.headerRight}>
                    {item.status === 'EM_ANDAMENTO' && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          router.navigate(`/carta-controle/edit/${item?.id}`)
                        }
                      >
                        <MaterialIcons name="edit" size={20} color="#084077" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.finishButton,
                        item?.status === 'FINALIZADO' &&
                          styles.finishButtonDisabled,
                      ]}
                      onPress={() => handleFinishCartaControle(item)}
                      disabled={item?.status === 'FINALIZADO'}
                    >
                      <MaterialIcons
                        name="check"
                        size={20}
                        color={
                          item?.status === 'FINALIZADO' ? '#084077' : '#16a34a'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Turno</Text>
                  <Text style={styles.value}>{item?.turno}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Documento Transporte (DT)</Text>
                  <Text style={styles.value}>{item?.documentoTransporte}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Remessa</Text>
                  <Text style={styles.value}>{item?.remessa}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Conferente/Técnico</Text>
                  <Text style={styles.value}>{item?.conferente}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Doca</Text>
                  <Text style={styles.value}>{item?.doca}</Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Capacidade Veículo</Text>
                  <Text style={styles.value}>{item?.capacidadeVeiculo}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Observações Gerais</Text>
                  <Text style={styles.value}>{item?.observacoes}</Text>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Nenhuma carta de controle encontrada
              </Text>
            </View>
          )}
        </View>
      </ScrollScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 80,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#084077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#084077',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  finishButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#084077',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  finishButtonDisabled: {
    opacity: 0.5,
  },
  field: {
    paddingLeft: 8,
    marginBottom: 16,
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    textAlign: 'center',
  },
});
