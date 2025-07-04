import { TipoEspecificacao } from '@/services/requests/enunciados/types';

export const tiposEspecificacao = [
  {
    label: 'Armazenamento',
    value: TipoEspecificacao.ARMAZENAMENTO,
  },
  {
    label: 'Recebimento',
    value: TipoEspecificacao.RECEBIMENTO,
  },
  {
    label: 'Separação e Montagem',
    value: TipoEspecificacao.SEPARACAO_MONTAGEM,
  },
];
