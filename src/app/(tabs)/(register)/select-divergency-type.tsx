import { useCallback } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Pressable, Text, useTheme } from 'native-base';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

export default function SelectDivergencyType() {
  const { colors } = useTheme();
  const { navigate } = router;

  const handleDivergency = useCallback(
    (type: 'falta' | 'sobra' | 'inversa') => {
      navigate(`/divergency/${type}`);
    },
    [navigate],
  );

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de Divergência">
      <Pressable onPress={() => handleDivergency('falta')}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Falta
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={() => handleDivergency('sobra')}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Sobra
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={() => handleDivergency('inversa')}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Inversão
            </Text>
          </HStack>
        </Card>
      </Pressable>
    </ScrollScreenContainer>
  );
}
