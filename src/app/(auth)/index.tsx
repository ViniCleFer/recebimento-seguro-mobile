import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Constants from 'expo-constants';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import Logo from '@/assets/icon-vfcode.png';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import useAuthStore from '@/store/auth';

import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/theme';

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

  const { setUserAuthenticated, setSigned } = useAuthStore(state => state);
  // const { setAuthenticatedUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [closedEyes, setClosedEyes] = useState(true);
  // const [email, setEmail] = useState('vini@teste.com');
  // const [password, setPassword] = useState('#opssh!');

  const {
    formState: { errors },
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

      console.log('SignIn => handleLogin', JSON.stringify(session, null, 2));

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

        console.log('SignIn => handleLogin', JSON.stringify(tokens, null, 2));

        setUserAuthenticated(user, tokens);
        setSigned(true);
        router.replace('/(tabs)/(list)');
      }
      setIsLoading(false);

      // Alert.alert('Login', 'Usuário ou senha inválidos');
    },
    [setUserAuthenticated, setSigned],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          <Input
            control={control}
            name="email"
            label="E-MAIL"
            placeholder="Digite seu e-mail"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            error={errors?.email}
          />

          <View style={styles.passwordContainer}>
            <Input
              label="SENHA"
              name="password"
              control={control}
              error={errors?.password}
              placeholder="Digite sua senha"
              secureTextEntry={closedEyes}
              autoComplete="off"
              style={styles.passwordInput}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => {
                setClosedEyes(prevState => !prevState);
              }}
            >
              <Feather
                name={closedEyes ? 'eye-off' : 'eye'}
                color={errors.password ? '#DC2626' : '#6B7280'}
                size={20}
              />
            </Pressable>
          </View>

          <Button
            title={isLoading ? 'Carregando...' : 'Entrar'}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading}
            style={[styles.loginButton, isLoading && styles.disabledButton]}
          />

          <TouchableOpacity
            onPress={() => {
              router.navigate('/sign-up');
            }}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate('/forgot-password');
            }}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            {/* <Text style={styles.copyrightText}>
              @Copyright VF Code LTDA {actualYear}
            </Text> */}
            <Text style={styles.versionText}>Versão {currentVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '8%',
    backgroundColor: 'transparent',
    zIndex: 100,
    width: '100%',
  },
  logoContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 50,
    color: colors.black,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 1,
  },
  loginButton: {
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkButton: {
    alignSelf: 'center',
    padding: 8,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
  },
  copyrightText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 12,
  },
});
