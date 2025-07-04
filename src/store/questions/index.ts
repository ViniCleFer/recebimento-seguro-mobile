import { FormPtp } from '@/services/requests/forms-ptp/types';
import { FormPtpAnswer } from '@/services/requests/form-ptp-answers/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface QuestionState {
  selectedInitialQuestion: FormPtp | null;
  setSelectedInitialQuestion: (question: FormPtp | null) => void;
  selectedQuestionOne: FormPtpAnswer | null;
  setSelectedQuestionOne: (question: FormPtpAnswer | null) => void;
  selectedQuestionTwo: FormPtpAnswer | null;
  setSelectedQuestionTwo: (question: FormPtpAnswer | null) => void;
  selectedQuestionThree: FormPtpAnswer | null;
  setSelectedQuestionThree: (question: FormPtpAnswer | null) => void;
  selectedQuestionFour: FormPtpAnswer | null;
  setSelectedQuestionFour: (question: FormPtpAnswer | null) => void;
  selectedQuestionFive: FormPtpAnswer | null;
  setSelectedQuestionFive: (question: FormPtpAnswer | null) => void;
  selectedQuestionSix: FormPtpAnswer | null;
  setSelectedQuestionSix: (question: FormPtpAnswer | null) => void;
  selectedQuestionSeven: FormPtpAnswer | null;
  setSelectedQuestionSeven: (question: FormPtpAnswer | null) => void;
  ptps: any[];
  setPtps: (ptp: any) => void;
  laudos: any[];
  setLaudos: (laudos: any) => void;
  divergencies: any[];
  setDivergencies: (divergencies: any) => void;
}

const useQuestionStore = create(
  persist<QuestionState>(
    set =>
      ({
        ptps: [],
        setPtps: (ptps: any) => {
          set({
            ptps: ptps,
          });
        },
        laudos: [],
        setLaudos: (laudos: any) => {
          set({
            laudos: laudos,
          });
        },
        divergencies: [],
        setDivergencies: (divergencies: any) => {
          set({
            divergencies: divergencies,
          });
        },
        selectedInitialQuestion: null,
        setSelectedInitialQuestion: (question: FormPtp | null) => {
          set({
            selectedInitialQuestion: question,
          });
        },
        selectedQuestionOne: null,
        setSelectedQuestionOne: (question: FormPtpAnswer) => {
          set({
            selectedQuestionOne: question,
          });
        },
        selectedQuestionTwo: null,
        setSelectedQuestionTwo: (question: FormPtpAnswer) => {
          set({
            selectedQuestionTwo: question,
          });
        },
        selectedQuestionThree: null,
        setSelectedQuestionThree: (question: FormPtpAnswer) => {
          set({
            selectedQuestionThree: question,
          });
        },
        selectedQuestionFour: null,
        setSelectedQuestionFour: (question: FormPtpAnswer) => {
          set({
            selectedQuestionFour: question,
          });
        },
        selectedQuestionFive: null,
        setSelectedQuestionFive: (question: FormPtpAnswer) => {
          set({
            selectedQuestionFive: question,
          });
        },
        selectedQuestionSix: null,
        setSelectedQuestionSix: (question: FormPtpAnswer) => {
          set({
            selectedQuestionSix: question,
          });
        },
        selectedQuestionSeven: null,
        setSelectedQuestionSeven: (question: FormPtpAnswer) => {
          set({
            selectedQuestionSeven: question,
          });
        },
      } as QuestionState),
    {
      name: 'ptpUseQuestionStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useQuestionStore;
