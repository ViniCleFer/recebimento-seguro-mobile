import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  Divergencia,
  TipoDivergencia,
} from '@/services/requests/divergences/types';
import { getDivergencesRequest } from '@/services/requests/divergences/utils';

import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';

export default function DivergenciesList() {
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {divergenciesList?.length > 0 ? (
            divergenciesList?.map(item => (
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
                        {dayjs(item?.created_at).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Tipo da Divergência</Text>
                  <Text style={styles.value}>{item?.tipoDivergencia}</Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Nota Fiscal</Text>
                  <Text style={styles.value}>{item?.notaFiscal}</Text>
                </View>

                {item?.tipoDivergencia === TipoDivergencia.FALTA && (
                  <>
                    <View style={styles.field}>
                      <Text style={styles.label}>Sku Faltando Fisicamente</Text>
                      <Text style={styles.value}>
                        {item?.skuFaltandoFisicamente}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>
                        Quantidade Faltando Fisicamente
                      </Text>
                      <Text style={styles.value}>
                        {item?.qtdFaltandoFisicamente}
                      </Text>
                    </View>
                  </>
                )}

                {item?.tipoDivergencia === TipoDivergencia.SOBRA && (
                  <>
                    <View style={styles.field}>
                      <Text style={styles.label}>Sku Sobrando Fisicamente</Text>
                      <Text style={styles.value}>
                        {item?.skuSobrandoFisicamente}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>
                        Quantidade Sobrando Fisicamente
                      </Text>
                      <Text style={styles.value}>
                        {item?.qtdSobrandoFisicamente}
                      </Text>
                    </View>
                  </>
                )}

                {item?.tipoDivergencia === TipoDivergencia.INVERSAO && (
                  <>
                    <View style={styles.field}>
                      <Text style={styles.label}>
                        Sku Recebemos Fisicamente
                      </Text>
                      <Text style={styles.value}>
                        {item?.skuRecebemosFisicamente}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>
                        Quantidade Recebemos Fisicamente
                      </Text>
                      <Text style={styles.value}>
                        {item?.qtdRecebemosFisicamente}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>Nota Fiscal SKU</Text>
                      <Text style={styles.value}>{item?.skuNotaFiscal}</Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>Quantidade Nota Fiscal</Text>
                      <Text style={styles.value}>{item?.qtdNotaFiscal}</Text>
                    </View>
                  </>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Próximos passos</Text>
                  <Text style={styles.value}>{item?.proximoPasso}</Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>UP de Origem</Text>
                  <Text style={styles.value}>{item?.upOrigem}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>CD de Origem</Text>
                  <Text style={styles.value}>{item?.cdOrigem}</Text>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Nenhuma divergência encontrada
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  container: {
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
