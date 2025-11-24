import '@/lib/dayjs';
import 'intl';
import 'intl/locale-data/jsonp/en';

import useAuthStore from '@/store/auth';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LogBox,
  StatusBar,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <MainLayout />
//     </AuthProvider>
//   );
// }

function InitialLayout() {
  const { signed } = useAuthStore(state => state);

  console.log('InitialLayout -> signed', signed);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!signed}>
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      </Stack.Protected>
      <Stack.Protected guard={signed}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [loading, setLoading] = useState(false);

  // const { session, initialized } = useAuth();

  // const segments = useSegments();
  // const router = useRouter();
  const { isUpdateAvailable, isDownloading } = Updates.useUpdates();

  console.log('Layout App');

  const [appIsReady, setAppIsReady] = useState(false);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
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
      console.log('Layout App Prepare');

      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(FontAwesome.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 3000));

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
      <StatusBar barStyle="light-content" translucent />
      <View style={{ flex: 1 }}>
        <InitialLayout />
      </View>
    </GestureHandlerRootView>
  );
}
