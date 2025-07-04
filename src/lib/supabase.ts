// import { AppState } from 'react-native';
// import 'react-native-url-polyfill/auto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createClient } from '@supabase/supabase-js';
// import { env } from './env';

// const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_PROJECT_URL;
// const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_API_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

// // Tells Supabase Auth to continuously refresh the session automatically
// // if the app is in the foreground. When this is added, you will continue
// // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// // `SIGNED_OUT` event if the user's session is terminated. This should
// // only be registered once.
// AppState.addEventListener('change', state => {
//   console.log('state', state);
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { env } from './env';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_API_KEY!;

// Use a custom secure storage solution for the Supabase client to store the JWT
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    detectSessionInUrl: false,
  },
});
