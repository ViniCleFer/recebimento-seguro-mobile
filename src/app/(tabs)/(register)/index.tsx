import { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Pressable, Text, useTheme } from 'native-base';

import { Card } from '@/components/Card';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { router } from 'expo-router';

export default function SelectFormType() {
  const { colors } = useTheme();
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

  return (
    <ScrollScreenContainer subtitle="Selecione o tipo de formulário para cadastro">
      <Pressable onPress={handleCreateFormPtp}>
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
              name="add-business"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              PTP Logístico
            </Text>
          </HStack>
        </Card>
      </Pressable>
      {/* <Pressable
        onPress={() => {
          navigate('/laudo-crm/58d40fbc-2848-4de7-83c0-a38e987d3313');
        }}
      >
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
              Laudo CRM
            </Text>
          </HStack>
        </Card>
      </Pressable> */}
      <Pressable onPress={handleCreateDivergencia}>
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
              name="add-chart"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Divergência
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={handleCreateCartaControle}>
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
              name="post-add"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Carta Controle
            </Text>
          </HStack>
        </Card>
      </Pressable>
    </ScrollScreenContainer>
  );
}
