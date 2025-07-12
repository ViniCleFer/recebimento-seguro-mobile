import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    <View style={styles.container}>
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
      />

      <Button
        title={isLoading ? 'Enviando...' : 'Enviar'}
        onPress={handleSubmit(handleForgotPassword)}
        disabled={isLoading}
        style={[styles.sendButton, isLoading && styles.disabledButton]}
      />

      <TouchableOpacity
        onPress={() => {
          router.navigate('/');
        }}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Voltar para o login</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
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
  sendButton: {
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkButton: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 8,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  logoContainer: {
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
});
