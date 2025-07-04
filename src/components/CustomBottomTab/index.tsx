import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { HStack, Image, Pressable, Text, useTheme } from 'native-base';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Constants from 'expo-constants';

// import LogoOPS from '@/assets/logo-ops.png';

export const CustomBottomTab = ({ navigation }: any) => {
  const { colors } = useTheme();

  const currentVersion = Constants?.default?.expoConfig?.version;

  const handle = useCallback(() => {
    navigation.navigate('Home');
  }, [CommonActions]);

  return (
    <HStack
      w="100%"
      backgroundColor={colors.white}
      position="absolute"
      bottom="0"
    >
      <Pressable
        px={4}
        py={2}
        onPress={handle}
        flexDirection="row"
        justifyContent="space-between"
        background={colors.primary[700]}
        flex={1}
        pb={Platform.OS === 'android' ? 3 : '36px'}
      >
        <MaterialIcons name="home" size={28} color={colors.white} />

        <Text
          position="absolute"
          top="15px"
          left="45%"
          fontSize="sm"
          color={colors.white}
          textAlign="center"
        >
          V. {currentVersion}
        </Text>
        {/* <Image
          source={LogoOPS}
          defaultSource={LogoOPS}
          alt='logo ops'
          w='100px'
          h='25px'
          resizeMode='contain'
        /> */}
      </Pressable>
    </HStack>
  );
};
