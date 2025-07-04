import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { router, Slot, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, ActivityIndicator, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEME } from '@/styles/theme';
import { Loading } from '@/components/Loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as Updates from 'expo-updates';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <MainLayout />
//     </AuthProvider>
//   );
// }

export default function RootLayout() {
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [loading, setLoading] = useState(false);

  // const { session, initialized } = useAuth();

  // const segments = useSegments();
  // const router = useRouter();
  const { isUpdateAvailable, isDownloading } = Updates.useUpdates();

  const [appIsReady, setAppIsReady] = useState(false);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar',
        'Ocorreu um erro ao tentar atualizar o App. Tente novamente mais tarde',
      );
    }
  };

  useEffect(() => {
    if (isUpdateAvailable && !isDownloading) {
      handleUpdate();
    }
  }, [isUpdateAvailable, isDownloading]);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(FontAwesome.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 5000));

        // return Alert.alert('Iniciando o App', 'O app está sendo carregado');
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        SplashScreen.hide();
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // const onLayoutRootView = useCallback(() => {
  //   if (appIsReady) {
  //     // setLoading(false);
  //     console.log('RootLayout -> onLayoutRootView -> appIsReady', appIsReady);
  //   }
  // }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'#2e2efe'} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
          translucent
        />
        <View style={{ flex: 1 }}>
          {/* <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="(auth)/dashboard" />
            <Stack.Screen name="(auth)/divergency/[type]" />
            <Stack.Screen name="(auth)/enunciado/[id]" />
            <Stack.Screen name="(auth)/form-ptp" />
            <Stack.Screen name="(auth)/forms-ptp-list" />
            <Stack.Screen name="(auth)/divergencies-list" />
            <Stack.Screen name="(auth)/laudo-crm/[id]" />
            <Stack.Screen name="(auth)/laudos-crm-list" />
            <Stack.Screen name="(auth)/select-divergency-type" />
            <Stack.Screen name="(auth)/select-form-type-to-list" />
            <Stack.Screen name="(auth)/select-form-type-to-register" />
          </Stack> */}
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </View>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
