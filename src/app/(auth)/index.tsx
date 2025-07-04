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

interface FormData {
  email: string;
  password: string;
}

const formValidation = (): any => {
  return z.object({
    email: z.string({ required_error: 'O campo E-mail é obrigatório.' }).email({
      message: 'O campo E-mail é inválido.',
    }),
    password: z
      .string({ required_error: 'O campo senha é obrigatório' })
      .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  });
};

export default function SignIn() {
  const currentVersion = Constants?.default?.expoConfig?.version;

  const { setUserAuthenticated } = useAuthStore(state => state);
  // const { setAuthenticatedUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [closedEyes, setClosedEyes] = useState(true);
  // const [email, setEmail] = useState('vini@teste.com');
  // const [password, setPassword] = useState('#opssh!');

  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formValidation()),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const actualYear = new Date().getFullYear();

  // useEffect(() => {
  //   // Verifica a sessão ao carregar o app
  //   // checkSession();

  //   // Monitora mudanças no estado de autenticação
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log('authListener', JSON.stringify(session, null, 2));
  //     if (session) {
  //       setAuthenticatedUser(session?.user);

  //       router.replace('/(auth)/dashboard');
  //       return;
  //     }

  //     setAuthenticatedUser(null);
  //     router.replace('/');
  //     return;
  //   });
  // }, []);

  const handleLogin = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);

      const {
        error,
        data: { session },
      } = await supabase.auth.signInWithPassword({
        email: formData?.email,
        password: formData?.password,
      });

      if (error) {
        setIsLoading(false);

        Alert.alert(
          'Login',
          'Erro ao logar um usuário, por favor tente novamente mais tarde',
        );
        console.error(
          'SignUp => handleSignUp',
          JSON.stringify(error?.message, null, 2),
        );
      }

      if (session) {
        const { access_token, refresh_token, user } = session;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
          .single();

        // console.log('SignIn => handleLogin', JSON.stringify(userData, null, 2));

        if (userError) {
          setIsLoading(false);
          console.error(
            'SignIn => User Permissions',
            JSON.stringify(error?.message, null, 2),
          );

          return Alert.alert(
            'Login',
            'Erro ao buscar um usuário pelo ID, por favor tente novamente mais tarde',
          );
        }

        if (
          userData?.permissions?.length === 0 ||
          !userData?.permissions?.includes('MOBILE')
        ) {
          setIsLoading(false);

          return Alert.alert(
            'Login',
            'Usuário sem permissão para acessar o aplicativo!',
          );
        }

        const tokens = {
          access_token,
          refresh_token,
        };

        setUserAuthenticated(user, tokens);
        router.replace('/(tabs)/(list)');
      }
      setIsLoading(false);

      // Alert.alert('Login', 'Usuário ou senha inválidos');
    },
    [supabase, setUserAuthenticated],
  );

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
        control={control}
        name="email"
        label="E-MAIL"
        placeholder="Digite seu e-mail"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        error={errors?.email}
        _focus={{ borderColor: 'primary.700' }}
        // value={email}
        // onChangeText={t => {
        //   setEmail(t);
        //   setValue('email', t);
        // }}
      />
      {/* 
      <Input
        label="LOGIN"
        name="email"
        control={control}
        placeholder="E-mail ou RE"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        error={errors.email}
        _focus={{ borderColor: 'primary.700' }}
      /> */}
      <Input
        label="SENHA"
        name="password"
        control={control}
        error={errors?.password}
        placeholder="Digite sua senha"
        secureTextEntry={closedEyes}
        autoComplete="off"
        _focus={{ borderColor: 'primary.700' }}
        // value={password}
        // onChangeText={t => {
        //   setPassword(t);
        //   setValue('password', t);
        // }}
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
      {/* <Input
        label="SENHA"
        name="password"
        control={control}
        error={errors.password}
        placeholder="Senha"
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
      /> */}

      <Button
        backgroundColor="primary.700"
        title="Entrar"
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
          router.navigate('/sign-up');
        }}
        alignSelf="center"
        padding={2}
      >
        Cadastre-se
      </Link>

      <Link
        onPress={() => {
          router.navigate('/forgot-password');
        }}
        alignSelf="center"
        padding={2}
      >
        Esqueceu a senha?
      </Link>

      <Box
        justifyContent="center"
        alignItems="center"
        position="fixed"
        bottom={'-8%'}
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
