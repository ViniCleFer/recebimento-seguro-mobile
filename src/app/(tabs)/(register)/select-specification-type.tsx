import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

export default function SelectDivergencyType() {
  const { navigate } = router;

  const handleSpecification = useCallback(
    (type: 'armazenamento' | 'recebimento' | 'separacao') => {
      navigate(`/specification/${type}`);
    },
    [navigate],
  );

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de Especificação">
      <TouchableOpacity onPress={() => handleSpecification('armazenamento')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="storage" size={30} color="#084077" />
            <Text style={styles.cardText}>Armazenamento</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSpecification('recebimento')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="receipt" size={30} color="#084077" />
            <Text style={styles.cardText}>Recebimento</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSpecification('separacao')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="dataset" size={30} color="#084077" />
            <Text style={styles.cardText}>Separação e Montagem</Text>
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
