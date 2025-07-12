import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { colors } from '@/styles/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray300,
    marginBottom: 18,
    minHeight: 68,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 0,
    shadowColor: colors.transparent,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: colors.gray900,
  },
});

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
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSpecification('armazenamento')}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="storage" size={30} color="#084077" />
          <Text style={styles.cardText}>Armazenamento</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSpecification('recebimento')}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="receipt" size={30} color="#084077" />
          <Text style={styles.cardText}>Recebimento</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSpecification('separacao')}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="dataset" size={30} color="#084077" />
          <Text style={styles.cardText}>Separação e Montagem</Text>
        </View>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}
