import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Redirect, router, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, ActivityIndicator, AppState, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { THEME } from '@/styles/theme';
import { Loading } from '@/components/Loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import useAuthStore from '@/store/auth';

export default function MainLayout() {
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [loading, setLoading] = useState(false);

  // const { session, initialized } = useAuth();

  // const segments = useSegments();
  // const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore(state => state);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('MainLayout useEffect');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('MainLayout useEffect getSession', session);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('MainLayout useEffect onAuthStateChange', session);
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const prepare = async () => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      console.log('Layout => Prepare', JSON.stringify(userData, null, 2));

      if (userError) {
        console.log(
          'Erro Layout => Prepare',
          JSON.stringify(userError, null, 2),
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
        return Alert.alert(
          'Login',
          'Usuário sem permissão para acessar o aplicativo!',
        );
      } else {
        return <Redirect href="/(tabs)/(list)" />;
      }
    };

    if (session && user) {
      prepare();
    }
  }, [session, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
