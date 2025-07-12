import { MaterialIcons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginTop: 8,
    marginBottom: 12,
    height: 80,
    justifyContent: 'center',
    padding: 12,
  },
  cardContent: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    color: '#6B7280',
    fontSize: 18,
  },
});

export default function SelectFormType() {
  const { navigate } = router;

  const handleListFormPtp = useCallback(() => {
    navigate('/forms-ptp-list');
  }, [navigate]);

  const handleListLaudoCrm = useCallback(() => {
    navigate('/laudos-crm-list');
  }, [navigate]);

  const handleListDivergencia = useCallback(() => {
    navigate('/divergencies-list');
  }, [navigate]);

  const handleListCartaControle = useCallback(() => {
    navigate('/cartas-controle-list');
  }, [navigate]);

  return (
    <ScrollScreenContainer subtitle="Selecione o evento para listagem">
      <TouchableOpacity onPress={handleListFormPtp}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="receipt-long" size={30} color="#084077" />
            <Text style={styles.cardText}>PTP Logístico</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleListLaudoCrm}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="note-alt" size={30} color="#084077" />
            <Text style={styles.cardText}>Laudo CRM</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleListDivergencia}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="difference" size={30} color="#084077" />
            <Text style={styles.cardText}>Divergência</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleListCartaControle}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="list-alt" size={30} color="#084077" />
            <Text style={styles.cardText}>Carta Controle</Text>
          </View>
        </Card>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}
