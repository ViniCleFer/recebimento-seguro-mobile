import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  FormPtpToLaudoCrm,
  type FormPtp,
} from '@/services/requests/forms-ptp/types';

export interface FormPtpState {
  formsPtp: Array<Partial<FormPtp>>;
  setFormsPtp: (formsPtp: FormPtp[]) => void;
  selectedFormPtp: Partial<FormPtpToLaudoCrm> | null;
  setSelectedFormPtp: (formPtp: FormPtpToLaudoCrm | null) => void;
}

const useFormPtpStore = create(
  persist<FormPtpState>(
    set =>
      ({
        formsPtp: [],
        setFormsPtp: (formsPtp: FormPtp[]) => {
          set({
            formsPtp,
          });
        },
        selectedFormPtp: null,
        setSelectedFormPtp: (formPtp: FormPtpToLaudoCrm | null) => {
          set({
            selectedFormPtp: formPtp,
          });
        },
      } as FormPtpState),
    {
      name: 'ptpUseFormPtpStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useFormPtpStore;
