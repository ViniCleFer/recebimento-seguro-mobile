import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { Box, Image, Link, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';

import Logo from '@/assets/icon-vfcode.png';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface FormData {
  email: string;
  password: string;
}

export default function ForgotPassword() {
  const { goBack } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const formValidation = useCallback((): any => {
    return z.object({
      email: z.string().email('"O campo E-mail é obrigatório."'),
    });
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formValidation()),
  });

  async function handleForgotPassword(formData: any) {
    setIsLoading(true);

    const response = await supabase.auth.resetPasswordForEmail(formData?.email);

    const { error } = response;

    if (error) {
      Alert.alert(
        'Esqueci a Senha',
        'Erro ao solicitar a recuperação de senha, tente novamente mais tarde',
      );
      console.error('Auth => handleForgotPassword', error);
      setIsLoading(false);
    } else {
      reset();
      Alert.alert(
        'Esqueci a Senha',
        'Solicitação de recuperação de senha realizada com sucesso! Verifique seu e-mail',
      );
      setIsLoading(false);
      goBack();
    }
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
      <Input
        label="E-MAIL"
        name="email"
        control={control}
        placeholder="Digite seu e-mail"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        error={errors.email}
        placeholderTextColor={'#999'}
        _focus={{ borderColor: 'primary.700' }}
      />

      <Button
        backgroundColor="primary.700"
        title="Enviar"
        mt={3}
        _pressed={{ bg: 'primary.600' }}
        variant={'solid'}
        _text={{
          color: 'white',
          fontWeight: 'bold',
        }}
        onPress={handleSubmit(handleForgotPassword)}
        isLoading={isLoading}
        disabled={isLoading}
      />

      <Link
        onPress={() => {
          router.navigate('/');
        }}
        alignSelf="center"
        padding={2}
        mt={2}
      >
        Voltar para o login
      </Link>
      <Box
        height="200px"
        width="200px"
        alignItems="center"
        justifyContent="center"
        mt={20}
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
    </VStack>
  );
}
