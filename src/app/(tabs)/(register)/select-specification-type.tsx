import { useCallback } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Pressable, Text, useTheme } from 'native-base';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

export default function SelectDivergencyType() {
  const { colors } = useTheme();
  const { navigate } = router;

  const handleSpecification = useCallback(
    (type: 'armazenamento' | 'recebimento' | 'separacao') => {
      navigate(`/specification/${type}`);
    },
    [navigate],
  );

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de Especificação">
      <Pressable onPress={() => handleSpecification('armazenamento')}>
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
              name="storage"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Armazenamento
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={() => handleSpecification('recebimento')}>
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
              name="receipt"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Recebimento
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={() => handleSpecification('separacao')}>
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
              name="dataset"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Separação e Montagem
            </Text>
          </HStack>
        </Card>
      </Pressable>
    </ScrollScreenContainer>
  );
}
