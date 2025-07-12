import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

export default function SelectDivergencyType() {
  const { navigate } = router;

  const handleDivergency = useCallback(
    (type: 'falta' | 'sobra' | 'inversa') => {
      navigate(`/divergency/${type}`);
    },
    [navigate],
  );

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de Divergência">
      <TouchableOpacity onPress={() => handleDivergency('falta')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="warning" size={30} color="#084077" />
            <Text style={styles.cardText}>Falta</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDivergency('sobra')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="add" size={30} color="#084077" />
            <Text style={styles.cardText}>Sobra</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDivergency('inversa')}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <MaterialIcons name="warning" size={30} color="#084077" />
            <Text style={styles.cardText}>Inversão</Text>
          </View>
        </Card>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  cardText: {
    fontSize: 18,
    color: '#084077',
    fontWeight: '600',
    marginLeft: 12,
  },
});
