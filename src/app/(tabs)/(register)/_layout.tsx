import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { router, Stack, useRouter, Tabs } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, ActivityIndicator, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { THEME } from '@/styles/theme';
import { Loading } from '@/components/Loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export default function MainLayout() {
  console.log('MainLayout Auth useEffect');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="divergency/[type]" />
      <Stack.Screen name="specification/[type]" />
      <Stack.Screen name="enunciado/[id]" />
      {/* <Stack.Screen name="form-ptp" /> */}
      <Stack.Screen name="carta-controle" />
      <Stack.Screen name="laudo-crm/[id]" />
      <Stack.Screen name="select-divergency-type" />
    </Stack>
  );
}
