import { MaterialIcons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { router } from 'expo-router';

export default function SelectFormType() {
  const { navigate } = router;

  const handleCreateFormPtp = useCallback(() => {
    navigate('/select-specification-type');
  }, [navigate]);

  const handleCreateDivergencia = useCallback(() => {
    navigate('/select-divergency-type');
  }, [navigate]);

  const handleCreateCartaControle = useCallback(() => {
    navigate('/carta-controle');
  }, [navigate]);

  const handleCreateLaudoCrm = useCallback(() => {
    navigate('/laudo-crm/4823648623424');
  }, [navigate]);

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de formulário para cadastro">
      <TouchableOpacity onPress={handleCreateFormPtp}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="add-business" size={30} color="#084077" />
            <Text style={styles.cardText}>PTP Logístico</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreateDivergencia}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="add-chart" size={30} color="#084077" />
            <Text style={styles.cardText}>Divergência</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreateCartaControle}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="post-add" size={30} color="#084077" />
            <Text style={styles.cardText}>Carta Controle</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCreateLaudoCrm}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="post-add" size={30} color="#084077" />
            <Text style={styles.cardText}>Laudo CRM</Text>
          </View>
        </Card>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}

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
