import { TipoDivergencia } from '@/services/requests/divergences/types';

export const tiposDivergencia = [
  {
    label: 'Falta',
    value: TipoDivergencia.FALTA,
  },
  {
    label: 'Sobra',
    value: TipoDivergencia.SOBRA,
  },
  {
    label: 'Inversão',
    value: TipoDivergencia.INVERSAO,
  },
];
