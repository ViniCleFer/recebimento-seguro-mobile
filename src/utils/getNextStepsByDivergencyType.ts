import { TipoDivergencia } from '@/services/requests/divergences/types';

export function getNextStepsByDivergencyType(
  tipoDivergencia: TipoDivergencia,
  sku: string,
  quantidade: string,
  skuNotaFiscal: string,
  quantidadeNotaFiscal: string,
) {
  const nextSteps = {
    [TipoDivergencia.FALTA]: `Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`,
    [TipoDivergencia.SOBRA]: `Solicitar para a origem o envio do saldo. (${sku} - ${quantidade})`,
    [TipoDivergencia.INVERSAO]: `Solicitar a origem que envie o saldo do físico recebido (${sku} - ${quantidade}).\nE devolver o saldo da nota fiscal para origem (${skuNotaFiscal} - ${quantidadeNotaFiscal}).`,
  };

  return nextSteps[tipoDivergencia];
}
