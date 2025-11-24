import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { colors } from '@/styles/theme';

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray300,
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
    <ScrollScreenContainer contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleListFormPtp}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="receipt-long" size={28} color={colors.primary} />
          <Text style={styles.cardText}>PTP Logístico</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={handleListLaudoCrm}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="note-alt" size={28} color={colors.primary} />
          <Text style={styles.cardText}>Laudo CRM</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={handleListDivergencia}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="difference" size={28} color={colors.primary} />
          <Text style={styles.cardText}>Divergência</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={handleListCartaControle}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="list-alt" size={28} color={colors.primary} />
          <Text style={styles.cardText}>Carta Controle</Text>
        </View>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}
