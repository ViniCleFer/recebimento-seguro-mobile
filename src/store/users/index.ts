import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserState {
  users: Array<Partial<User>>;
  selectedUser: Partial<User> | null;
  setSelectedUser: (user: User) => void;
  setUsers: (users: User[]) => void;
}

const useUserStore = create(
  persist<UserState>(
    (set) =>
      ({
        users: [],
        selectedUser: null,
        setSelectedUser: (user: User) => {
          set({
            selectedUser: user,
          });
        },
        setUsers: (users: User[]) => {
          set({
            users,
          });
        },
      } as UserState),
    {
      name: 'sheUseUserStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
