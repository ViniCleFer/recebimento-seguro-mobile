import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import {
  HStack,
  type IContainerProps,
  Image,
  Pressable,
  Select,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, useWindowDimensions } from 'react-native';

// import LogoYpe from '@/assets/ype.png';
import useAuthStore from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
// import useFactoryPlantStore from '../../store/factories';

interface HeaderProps extends IContainerProps {}

export const Header = ({ ...rest }: HeaderProps) => {
  const { colors } = useTheme();
  const navigationState = useNavigationState(state => state);

  const { width } = useWindowDimensions();

  const router = useRouter();

  const { user, setUserAuthenticated } = useAuthStore(state => state);

  // const factoriesPlant = useFactoryPlantStore(state => state.factoriesPlant);
  // const setFactoriesPlant = useFactoryPlantStore(
  //   state => state.setFactoriesPlant,
  // );
  // const selectedFactoryPlant = useFactoryPlantStore(
  //   state => state.selectedFactoryPlant,
  // );
  // const setSelectedFactoryPlant = useFactoryPlantStore(
  //   state => state.setSelectedFactoryPlant,
  // );

  const [hasNavigation, setHasNavigation] = useState(false);

  // console.log('user', JSON.stringify(name, null, 2));

  useEffect(() => {
    if (navigationState && navigationState?.index > 0) {
      setHasNavigation(true);
    } else {
      setHasNavigation(false);
    }
  }, [navigationState]);

  // const loadFactories = useCallback(() => {
  //   getFactoryPlantsRequest().then(response => {
  //     setFactoriesPlant(response);

  //     if (response && response?.length === 1) {
  //       setSelectedFactoryPlant(response[0]);
  //     }
  //   });
  // }, [setFactoriesPlant, setSelectedFactoryPlant]);

  // useEffect(() => {
  //   if (user) {
  //     loadFactories();
  //   }
  // }, [user, loadFactories]);

  // const handleFactoryPlantChange = useCallback(
  //   (value: string) => {
  //     const factory = factoriesPlant?.find(
  //       factoryPlant => factoryPlant.idSite === Number(value),
  //     );

  //     if (!factory) {
  //       return '';
  //     }

  //     setSelectedFactoryPlant(factory);
  //   },
  //   [factoriesPlant, setSelectedFactoryPlant],
  // );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Erro ao sair', 'Por favor, tente novamente mais tarde');

      console.error('Error logging out:', error.message);
      return;
    }

    setUserAuthenticated(null, null);
    router.replace('/(auth)');
  }, [supabase, router, setUserAuthenticated]);

  // const update = useCallback(async () => {
  //   const data = {
  //     name: 'Vinicius Fernandes',
  //   };

  //   const { data: responseData, error } = await supabase.auth.updateUser({
  //     data,
  //   });

  //   console.log('responseData', JSON.stringify(responseData, null, 2));

  //   // if (error) {
  //   //   Alert.alert('Erro ao sair', 'Por favor, tente novamente mais tarde');

  //   //   console.error('Error logging out:', error.message);
  //   //   return;
  //   // }
  // }, [supabase]);

  return (
    <HStack
      bg={colors.white}
      pl={'14px'}
      pr={'12px'}
      // pb={hasNavigation ? 0 : Platform.OS === 'android' ? 0 : '4px'}
      width={width}
      maxW={width}
      // justifyContent={hasNavigation ? 'space-between' : 'flex-start'}
      justifyContent={'space-between'}
      alignItems="center"
      pt={Platform.OS === 'android' ? '36px' : '70px'}
      // shadow="8"
      {...rest}
    >
      <HStack alignItems="center">
        {hasNavigation && (
          <Pressable
            p={1}
            display="flex"
            borderRadius={4}
            justifyContent="center"
            alignItems="center"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name={'arrow-back-ios'}
              size={20}
              color={colors.gray[500]}
            />
          </Pressable>
        )}

        {hasNavigation ? (
          <Text fontSize="xl" fontWeight="medium" textTransform="capitalize">
            {user?.user_metadata?.name
              ? user?.user_metadata?.name?.split(' ')?.length > 2
                ? user?.user_metadata?.name?.split(' ')[0]
                : user?.user_metadata?.name
              : 'Admin'}
          </Text>
        ) : (
          <VStack width="75%">
            <Text fontSize="xl" fontWeight="medium" textTransform="capitalize">
              {user?.user_metadata?.name
                ? user?.user_metadata?.name?.split(' ')?.length > 2
                  ? user?.user_metadata?.name?.split(' ')[0]
                  : user?.user_metadata?.name
                : 'Admin'}
            </Text>
          </VStack>
        )}
      </HStack>
      <HStack alignItems="center" space={2}>
        {/* <Image
          mb={0.5}
          ml={-3}
          mr={-1}
          source={LogoYpe}
          defaultSource={LogoYpe}
          width={16}
          height={16}
          resizeMode="contain"
          alt="logo"
        /> */}
      </HStack>
      <Pressable
        p={1}
        borderRadius={4}
        justifyContent="center"
        position="relative"
        onPress={signOut}
      >
        <MaterialIcons name="logout" color={colors.primary[700]} size={28} />
      </Pressable>
    </HStack>
  );
};
