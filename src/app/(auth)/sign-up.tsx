import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Constants from 'expo-constants';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  Pressable,
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <Input
        label="NOME"
        name="name"
        control={control}
        placeholder="Digite o nome"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.name}
      />

      <Input
        label="E-MAIL"
        name="email"
        control={control}
        placeholder="Digite o e-mail"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        error={errors.email}
      />

      <View style={styles.passwordContainer}>
        <Input
          label="SENHA"
          name="password"
          control={control}
          error={errors.password}
          placeholder="Digite a senha"
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
        title={isLoading ? 'Carregando...' : 'Cadastrar'}
        onPress={handleSubmit(handleLogin)}
        disabled={isLoading}
        style={[styles.signUpButton, isLoading && styles.disabledButton]}
      />

      <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
        <Text style={styles.linkText}>Voltar para o login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        {/* <Text style={styles.copyrightText}>
          @Copyright VF Code LTDA {actualYear}
        </Text> */}
        <Text style={styles.versionText}>Versão {currentVersion}</Text>
      </View>
    </View>
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
  signUpButton: {
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
