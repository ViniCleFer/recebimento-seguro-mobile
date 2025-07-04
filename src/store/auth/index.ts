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
  signOut: () => void;
  setLoading: (status: boolean) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    set =>
      ({
        tokens: null,
        signed: false,
        loading: false,
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
      } as AuthState),
    {
      name: 'sheUseAuthStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
