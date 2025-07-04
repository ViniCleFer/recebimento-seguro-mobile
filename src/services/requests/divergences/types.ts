export enum TipoDivergencia {
  FALTA = 'FALTA',
  SOBRA = 'SOBRA',
  INVERSAO = 'INVERSAO',
}

export interface EvidenciaPost {
  base64: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface Evidencia {
  id: string;
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  user_id: string;
  laudoCrmId: string | null;
  divergenciaId: string | null;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface Divergencia {
  id: string;
  tipoDivergencia: TipoDivergencia;
  evidencias: Evidencia[];
  skuFaltandoFisicamente: string | null;
  qtdFaltandoFisicamente: number | null;
  skuSobrandoFisicamente: string | null;
  qtdSobrandoFisicamente: number | null;
  skuRecebemosFisicamente: string | null;
  qtdRecebemosFisicamente: number | null;
  skuNotaFiscal: string | null;
  qtdNotaFiscal: number | null;
  proximoPasso: string;
  upOrigem: string;
  cdOrigem: string;
  notaFiscal: string;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface DivergenciaPost {
  tipoDivergencia: TipoDivergencia;
  evidencias: EvidenciaPost[];
  skuFaltandoFisicamente: string | null;
  qtdFaltandoFisicamente: number | null;
  skuSobrandoFisicamente: string | null;
  qtdSobrandoFisicamente: number | null;
  skuRecebemosFisicamente: string | null;
  qtdRecebemosFisicamente: number | null;
  skuNotaFiscal: string | null;
  qtdNotaFiscal: number | null;
  proximoPasso: string;
  upOrigem: string;
  cdOrigem: string;
  notaFiscal: string;
  user_id: string;
}

export interface DivergenciaPut extends DivergenciaPost {
  id: string;
}
