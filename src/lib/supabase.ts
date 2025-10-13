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

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_API_KEY!;

// SecureStore has a 2048 byte limit per key
// Split large values into chunks to avoid the warning
const CHUNK_SIZE = 2048;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      // Try to get the first chunk
      const firstChunk = await SecureStore.getItemAsync(key);
      if (!firstChunk) return null;

      // Check if there are additional chunks
      const chunkCountStr = await SecureStore.getItemAsync(`${key}_chunks`);
      if (!chunkCountStr) {
        // No chunks, return the value as-is
        return firstChunk;
      }

      // Reconstruct the value from chunks
      const chunkCount = parseInt(chunkCountStr, 10);
      let fullValue = firstChunk;

      for (let i = 1; i < chunkCount; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}_${i}`);
        if (chunk) {
          fullValue += chunk;
        }
      }

      return fullValue;
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      // If value is small enough, store it directly
      if (value.length <= CHUNK_SIZE) {
        await SecureStore.setItemAsync(key, value);
        // Clean up any existing chunks
        await SecureStore.deleteItemAsync(`${key}_chunks`);
        return;
      }

      // Split value into chunks
      const chunks: string[] = [];
      for (let i = 0; i < value.length; i += CHUNK_SIZE) {
        chunks.push(value.substring(i, i + CHUNK_SIZE));
      }

      // Store each chunk
      for (let i = 0; i < chunks.length; i++) {
        await SecureStore.setItemAsync(i === 0 ? key : `${key}_${i}`, chunks[i]);
      }

      // Store chunk count for retrieval
      await SecureStore.setItemAsync(`${key}_chunks`, chunks.length.toString());
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      // Remove main key
      await SecureStore.deleteItemAsync(key);

      // Check for chunks and remove them
      const chunkCountStr = await SecureStore.getItemAsync(`${key}_chunks`);
      if (chunkCountStr) {
        const chunkCount = parseInt(chunkCountStr, 10);
        for (let i = 1; i < chunkCount; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}_chunks`);
      }
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    detectSessionInUrl: false,
  },
});
