import { TipoEvidenciaCartaControle } from '@/services/requests/cartas-controle/types';

export const tiposEvidenciaCartaControle = [
  {
    label: 'Ordem de Carregamento',
    value: TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
  },
  {
    label: 'Carga em Doca',
    value: TipoEvidenciaCartaControle.CARGA_DOCA,
  },
  {
    label: 'Início do Carregamento',
    value: TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
  },
  {
    label: 'Meio do Carregamento',
    value: TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
  },
  {
    label: 'Final do Carregamento',
    value: TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
  },
  {
    label: 'Placa do Veículo',
    value: TipoEvidenciaCartaControle.PLACA_VEICULO,
  },
];
