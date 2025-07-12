import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { type FormPtp } from '@/services/requests/forms-ptp/types';
import { getFormsPtpRequest } from '@/services/requests/forms-ptp/utils';
import { listaUPsOrigem } from '@/utils/listaUPs';
import { tiposEspecificacao } from '@/utils/tiposEspecificacao';

export default function FormsPtpList() {
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {formsPtpList?.length > 0 ? (
            formsPtpList?.map(item => (
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
                      <Text style={styles.label}>Data do recebimento</Text>
                      <Text style={styles.value}>
                        {item?.dataExecucao as string}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Conferente/Técnico</Text>
                  <Text style={styles.value}>{item?.conferente}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Nota Fiscal</Text>
                  <Text style={styles.value}>{item?.notaFiscal}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>UP Recebimento</Text>
                  <Text style={styles.value}>{item?.opcaoUp}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Tipo</Text>
                  <Text style={styles.value}>
                    {
                      tiposEspecificacao?.find(
                        u => u?.value === item?.tipoEspecificacao,
                      )?.label
                    }
                  </Text>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum formulário encontrado</Text>
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
