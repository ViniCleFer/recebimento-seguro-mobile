import {
  Enunciado,
  GrupoEnunciado,
} from '@/services/requests/enunciados/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface EnunciadoState {
  enunciados:
    | {
        grupo: GrupoEnunciado;
        grupoFormatado: string;
        enunciados: Enunciado[];
      }[]
    | null;
  setEnunciados: (
    factories:
      | {
          grupo: GrupoEnunciado;
          grupoFormatado: string;
          enunciados: Enunciado[];
        }[]
      | null,
  ) => void;
  answers: any[];
  setAnswers: (answers: any[]) => void;
}

const useEnunciadoStore = create(
  persist<EnunciadoState>(
    set =>
      ({
        enunciados: [],
        setEnunciados: (
          enunciados: {
            grupo: GrupoEnunciado;
            grupoFormatado: string;
            enunciados: Enunciado[];
          }[],
        ) => {
          set({
            enunciados,
          });
        },
        answers: [],
        setAnswers: (answers: any[]) => {
          set({
            answers,
          });
        },
      }) as EnunciadoState,
    {
      name: 'ptpUseEnunciadoStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useEnunciadoStore;
