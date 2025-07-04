import { FormPtpAnswer } from '../form-ptp-answers/types';

export enum TipoEvidencia {
  UC = 'UC',
  ETIQUETA_CAIXA = 'ETIQUETA_CAIXA',
  AVARIAS = 'AVARIAS',
  PALLETS = 'PALLETS',
}

export enum Turno {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
}

export enum TipoNaoConformidade {
  PALLET_COM_AVARIA = 'PALLET_COM_AVARIA',
  PALLET_COM_DIVERGENCIA_DE_LOTE = 'PALLET_COM_DIVERGENCIA_DE_LOTE',
  PALLET_COM_FALTA = 'PALLET_COM_FALTA',
  PALLET_COM_STRECH_RASGADO = 'PALLET_COM_STRECH_RASGADO',
  PALLET_COM_SUJIDADE = 'PALLET_COM_SUJIDADE',
  PALLET_DESALINHADO = 'PALLET_DESALINHADO',
  PALLET_QUEBRADO = 'PALLET_QUEBRADO',
}

export interface Evidencia {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
  user_id: string;
  laudoCrmId?: string | null;
  divergenciaId?: string | null;
}

export interface EvidenciaPost {
  base64: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface LaudoCrm {
  form_ptp_id: string;
  id: string;
  remessa: string;
  transportador: string;
  placa: string;
  notaFiscal: string;
  dataIdentificacao: Date;
  conferente: string;
  turno: Turno;
  upOrigem: string;
  cdOrigem: string;
  tiposNaoConformidade: TipoNaoConformidade[];
  observacoes: string;
  evidencias: string[];
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface LaudoCrmWithAnswer extends LaudoCrm, FormPtpAnswer {
  lotes: string[];
  codigosProdutos: string[];
  qtdCaixasNaoConformes: string[];
}

export interface LaudoCrmPost {
  remessa: string;
  transportador: string;
  placa: string;
  notaFiscal: string;
  dataIdentificacao: Date;
  conferente: string;
  turno: Turno;
  upOrigem: string;
  cdOrigem: string;
  tiposNaoConformidade: TipoNaoConformidade[];
  evidencias: EvidenciaPost[];
  form_ptp_id: string;
  observacoes: string;
  lotes: string[];
  codigoProdutos: string[];
  qtdCaixasNaoConformes: string[];
  user_id: string;
}

export interface LaudoCrmPut extends LaudoCrmPost {
  id: string;
}
