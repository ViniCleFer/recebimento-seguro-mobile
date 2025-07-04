export enum TipoEvidenciaCartaControle {
  ORDEM_CARREGAMENTO = 'ORDEM_CARREGAMENTO',
  CARGA_DOCA = 'CARGA_DOCA',
  INICIO_CARREGAMENTO = 'INICIO_CARREGAMENTO',
  MEIO_CARREGAMENTO = 'MEIO_CARREGAMENTO',
  FINAL_CARREGAMENTO = 'FINAL_CARREGAMENTO',
  PLACA_VEICULO = 'PLACA_VEICULO',
}

export enum Turno {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
}

export interface EvidenciaPost {
  base64: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface CartaControle {
  id: string;
  dataIdentificacao: Date;
  turno: Turno;
  documentoTransporte: string;
  remessa: string;
  conferente: string | null;
  doca: string | null;
  capacidadeVeiculo: string | null;
  evidencias: string[];
  observacoes: string | null;
  status: 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  user_id: string;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface CartaControlePost {
  dataIdentificacao: Date;
  turno: Turno;
  documentoTransporte: string;
  remessa: string;
  conferente: string | null;
  doca: string | null;
  capacidadeVeiculo: string | null;
  evidencias: string[];
  observacoes: string | null;
  status: 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  user_id: string;
}

export interface CartaControlePut extends CartaControlePost {
  id: string;
}
