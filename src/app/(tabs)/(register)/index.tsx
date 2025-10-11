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
    <ScrollScreenContainer subtitle="Selecione o tipo de formulário">
      <TouchableOpacity
        onPress={handleCreateFormPtp}
        style={styles.card}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="add-business" size={30} color="#084077" />
          <Text style={styles.cardText}>PTP Logístico</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCreateDivergencia}
        style={styles.card}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="add-chart" size={30} color="#084077" />
          <Text style={styles.cardText}>Divergência</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCreateCartaControle}
        style={styles.card}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="post-add" size={30} color="#084077" />
          <Text style={styles.cardText}>Carta Controle</Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={handleCreateLaudoCrm}
        style={styles.card}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="post-add" size={30} color="#084077" />
          <Text style={styles.cardText}>Laudo CRM</Text>
        </View>
      </TouchableOpacity> */}
    </ScrollScreenContainer>
  );
}
