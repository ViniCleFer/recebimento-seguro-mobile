import { useCallback, useState } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Icon, Image, Link, Pressable, Text, VStack } from 'native-base';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';
import * as Constants from 'expo-constants';
import { router } from 'expo-router';

import Logo from '@/assets/icon-vfcode.png';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import useAuthStore from '@/store/auth';

import { supabase } from '@/lib/supabase';

import { setUserLocalStorage } from '@/services/requests/auth/helpers';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const currentVersion = Constants?.default?.expoConfig?.version;

  const setUserAuthenticated = useAuthStore(
    state => state.setUserAuthenticated,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [closedEyes, setClosedEyes] = useState(true);

  const formValidation = useCallback((): any => {
    return z.object({
      name: z.string({ required_error: 'O campo Nome é obrigatório.' }),
      email: z
        .string({ required_error: 'O campo E-mail é obrigatório.' })
        .email('O campo E-mail é obrigatório.'),
      password: z.string({ required_error: 'O campo senha é obrigatório' }),
    });
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formValidation()),
  });

  const actualYear = new Date().getFullYear();

  async function handleLogin(formData: any) {
    setIsLoading(true);

    console.log('SignUp => formData', formData?.email);

    const {
      error,
      data: { session },
    } = await supabase.auth.signUp({
      email: formData?.email,
      password: formData?.password,
      options: {
        data: {
          name: formData?.name,
        },
      },
    });

    if (error) {
      console.error('SignUp => handleSignUp', JSON.stringify(error, null, 2));
      Alert.alert(
        'Login',
        'Erro ao logar um usuário, por favor tente novamente mais tarde',
      );
    }

    if (session) {
      const { access_token, refresh_token, user } = session;

      const tokens = {
        access_token,
        refresh_token,
      };

      setUserAuthenticated(user, tokens);
      router.replace('/(tabs)/(list)');
    }
    setIsLoading(false);

    // Alert.alert('Login', 'Usuário ou senha inválidos');
  }

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      zIndex={100}
      w="100%"
      px={'8%'}
      bg="transparent"
      flex={1}
    >
      {/* <Text color="gray.750" mb={10}>
        EHS
      </Text> */}
      <Box
        height="100px"
        width="100px"
        alignItems="center"
        justifyContent="center"
        mb={10}
        borderRadius={10}
        overflow={'hidden'}
      >
        <Image
          alt="logo ehs"
          source={Logo}
          defaultSource={Logo}
          height={'100%'}
          resizeMode="contain"
        />
      </Box>

      <Input
        label="NAME"
        name="name"
        control={control}
        placeholder="Digite o nome"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.name}
        _focus={{ borderColor: 'primary.700' }}
      />
      <Input
        label="LOGIN"
        name="email"
        control={control}
        placeholder="Digite o e-mail"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        error={errors.email}
        _focus={{ borderColor: 'primary.700' }}
      />
      <Input
        label="SENHA"
        name="password"
        control={control}
        error={errors.password}
        placeholder="Digite a senha"
        secureTextEntry={closedEyes}
        autoComplete="off"
        _focus={{ borderColor: 'primary.700' }}
        InputRightElement={
          <Pressable
            display="center"
            alignItems="center"
            justifyContent="center"
            p={4}
            onPress={() => {
              setClosedEyes(prevState => !prevState);
            }}
          >
            <Icon
              as={Feather}
              name={closedEyes ? 'eye-off' : 'eye'}
              color={errors.password ? 'secondary.700' : 'gray.700'}
              size={4}
              focusable
            />
          </Pressable>
        }
      />

      <Button
        backgroundColor="primary.700"
        title="Cadastrar"
        my={2}
        _pressed={{ bg: 'primary.600' }}
        variant={'solid'}
        _text={{
          color: 'white',
        }}
        onPress={handleSubmit(handleLogin)}
        isLoading={isLoading}
        disabled={isLoading}
        leftIcon={<Icon as={MaterialIcons} name="login" size="md" />}
      />

      <Link
        onPress={() => {
          router.navigate('/');
        }}
        alignSelf="center"
        padding={2}
      >
        Voltar para o login
      </Link>

      {/* <Button
        backgroundColor="primary.700"
        title="Logout"
        my={2}
        _pressed={{ bg: 'primary.600' }}
        variant={'solid'}
        _text={{
          color: 'white',
        }}
        onPress={async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert(
              'Erro ao sair',
              'Por favor, tente novamente mais tarde',
            );

            console.error('Error logging out:', error.message);
            return;
          }
        }}
        isLoading={isLoading}
        disabled={isLoading}
        leftIcon={<Icon as={MaterialIcons} name="login" size="md" />}
      /> */}

      <Box
        justifyContent="center"
        alignItems="center"
        position="fixed"
        bottom={'-6%'}
      >
        <Text color="gray.750" fontSize="12px" fontWeight="semibold">
          @Copyright VF Code LTDA {actualYear}
        </Text>
        <Text color="gray.700" fontSize="12px">
          Versão {currentVersion}
        </Text>
      </Box>
    </VStack>
  );
}
