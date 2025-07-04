import { TipoEspecificacao } from '../enunciados/types';

export enum Enunciado {
  NUM_CAMADAS = 'NUM_CAMADAS',
  LIMPEZA = 'LIMPEZA',
  PRESENCA_DATA_FABRICACAO = 'PRESENCA_DATA_FABRICACAO',
  INTEGRIDADE_PALLET = 'INTEGRIDADE_PALLET',
  AUSENCIA_VAZAMENTO = 'AUSENCIA_VAZAMENTO',
  STRECH_FORRACAO = 'STRECH_FORRACAO',
  ETIQUETA_UC = 'ETIQUETA_UC',
}

export interface FormPtpAnswer {
  id: string;
  form_ptp_id: string;
  enunciado: Enunciado;
  codProduto: string;
  lote: string | null;
  naoConformidade: boolean;
  detalheNaoConformidade: string;
  qtdPalletsNaoConforme: number;
  qtdCaixasNaoConforme: number;
  necessitaCrm: boolean;
  tipoEspecificacao: TipoEspecificacao;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface FormPtpAnswerPost {
  form_ptp_id: string;
  enunciado_id: string;
  codProduto: string;
  naoConformidade: boolean;
  detalheNaoConformidade: string[] | any;
  lote: string | null;
  qtdPalletsNaoConforme: number;
  qtdCaixasNaoConforme: number;
  necessitaCrm: boolean;
  tipoEspecificacao: TipoEspecificacao;
}

export interface FormPtpAnswerPut extends FormPtpAnswerPost {
  id: string;
}
