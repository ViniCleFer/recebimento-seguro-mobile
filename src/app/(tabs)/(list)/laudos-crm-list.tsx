import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { Image } from 'expo-image';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { LaudoCrmWithAnswer } from '@/services/requests/laudos/types';
import { getLaudosCrmRequest } from '@/services/requests/laudos/utils';

import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';
import { tiposNaoConformidade as tiposNaoConformidadeList } from '@/utils/tiposNaoConformidade';

export default function LuadoCrmList() {
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {laudosCrmList?.length > 0 ? (
            laudosCrmList?.map(item => (
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
                      <Text style={styles.label}>Data de Transporte</Text>
                      <Text style={styles.value}>
                        {dayjs(item?.dataIdentificacao).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Transportador</Text>
                  <Text style={styles.value}>{item?.transportador}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Remessa</Text>
                  <Text style={styles.value}>{item?.remessa}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Placa</Text>
                  <Text style={styles.value}>{item?.placa}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Nota Fiscal</Text>
                  <Text style={styles.value}>{item?.notaFiscal}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Conferente/Técnico</Text>
                  <Text style={styles.value}>{item?.conferente}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Turno</Text>
                  <Text style={styles.value}>{item?.turno}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>UP de Origem</Text>
                  <Text style={styles.value}>{item?.upOrigem}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>CD de Origem</Text>
                  <Text style={styles.value}>{item?.cdOrigem}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Tipos de Não Conformidade</Text>
                  <Text style={styles.value}>{item?.tiposNaoConformidade}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Lotes não conformes</Text>
                  <Text style={styles.value}>{item?.lotes}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Códigos dos produtos não conformes
                  </Text>
                  <Text style={styles.value}>{item?.codigosProdutos}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Qtd. Caixas não conformes</Text>
                  <Text style={styles.value}>
                    {item?.qtdCaixasNaoConformes}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Observações Gerais</Text>
                  <Text style={styles.value}>{item?.observacoes}</Text>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum laudo encontrado</Text>
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
