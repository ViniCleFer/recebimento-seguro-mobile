import {
  EnunciadoToList,
  TipoEspecificacao,
} from '@/services/requests/enunciados/types';
import { wordNormalize } from './wordNormalize';
// import { tiposNaoConformidade } from './tiposNaoConformidade';

// function getNaoConformidades(posicao: number, grupo: GrupoEnunciado) {
//   switch (posicao) {
//     case 1:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: true,
//           naoConformidade: ['PALLET_COM_FALTA'],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: false,
//           naoConformidade: ["PALLET_COM_AVARIA", "PALLET_COM_SUJIDADE"],
//         };
//       }
//     case 2:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: false,
//           naoConformidade: ['PALLET_DESALINHADO', 'PALLET_TOMBADO'],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: true,
//           naoConformidade: ['PALLET_COM_AVARIA'],
//         };
//       }
//     case 3:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: true,
//           naoConformidade: ['PALLET_QUEBRADO'],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: true,
//           naoConformidade: ["CAIXA_SEM_ETIQUETA"],
//         };
//       }
//     case 4:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: true,
//           naoConformidade: [
//             "PALLET_COM_STRECH_RASGADO",
//             "PALLET_SEM_STRECH_NO_PE",
//           ],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: true,
//           naoConformidade: ["CAIXA_COM_MAIS_DE_UMA_ETIQUETA"],
//         };
//       }
//     case 5:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: false,
//           naoConformidade: [],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: true,
//           naoConformidade: ["ETIQUETA_NAO_EQUIVALE_AO_PRODUTO"],
//         };
//       }
//     case 6:
//       if (grupo === GrupoEnunciado.PALETE) {
//         return {
//           isChecked: false,
//           naoConformidade: [],
//         };
//       }
//       if (grupo === GrupoEnunciado.CAIXA_E_FARDO) {
//         return {
//           isChecked: true,
//           naoConformidade: ["PRODUTO_EM_SHELF_LIFE"],
//         };
//       }
//     default:
//       return {
//         isChecked: false,
//         naoConformidade: tiposNaoConformidade.map(item => item.value),
//       };
//   }
// }

export const formatEnunciadoList = (
  enunciadoList: EnunciadoToList[],
  type: TipoEspecificacao,
) => {
  if (enunciadoList?.length === 0) {
    return [];
  }

  const resultado = enunciadoList
    ?.filter(e => e.tipoEspecificacao === type)
    ?.reduce((acc, item, index) => {
      const { grupo } = item;

      item.index = index;

      const existingGroup = acc?.find(group => group?.grupo === grupo);

      if (existingGroup) {
        existingGroup?.enunciados?.push(item);
      } else {
        acc.push({
          grupo,
          grupoFormatado: wordNormalize(grupo),
          enunciados: [item],
        });
      }

      return acc;
    }, [] as any[]);

  return resultado;
};
