import '@/lib/dayjs';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/auth';
import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function MainLayout() {
  const { user, setSigned } = useAuthStore(state => state);
  const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   console.log('MainLayout useEffect');
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log('MainLayout useEffect getSession', session);
  //     setSession(session);
  //     setSigned(true);
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log('MainLayout useEffect onAuthStateChange', session);
  //     setSession(session);
  //     setSigned(true);
  //   });
  // }, [setSigned]);

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

      // if (
      //   userData?.permissions?.length === 0 ||
      //   !userData?.permissions?.includes('MOBILE')
      // ) {
      //   setSigned(false);
      //   return Alert.alert(
      //     'Login',
      //     'Usuário sem permissão para acessar o aplicativo!',
      //   );
      // } else {
      //   setSigned(true);
      //   // return <Redirect href="/(tabs)/(list)" />;
      // }
    };

    if (session && user) {
      prepare();
    }
  }, [session, user, setSigned]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
