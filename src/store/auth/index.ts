import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Tokens } from '@/services/requests/auth/types';
import { User } from '@supabase/supabase-js';
// import { type User } from '../../services/requests/users/types';

export interface AuthState {
  tokens: Tokens | null;
  signed: boolean;
  loading: boolean;
  user: User | null;
  setUserAuthenticated: (user: User | null, tokens: Tokens | null) => void;
  setUser: (user: User | null) => void;
  signOut: () => void;
  setLoading: (status: boolean) => void;
  setSigned: (signed: boolean) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    set =>
      ({
        tokens: null,
        signed: false,
        loading: false,
        setUser: (user: User | null) => {
          set({
            user,
          });
        },
        setUserAuthenticated: (user: User | null, tokens: Tokens | null) => {
          set({
            signed: true,
            user,
            tokens,
          });
        },
        signOut: () => {
          set({
            signed: false,
            user: null,
            tokens: null,
          });
        },
        setLoading: (status: boolean) => {
          set({
            loading: status,
          });
        },
        setSigned: (signed: boolean) => {
          set({
            signed,
          });
        },
      } as AuthState),
    {
      name: 'ptpUseAuthStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
