import { TipoEvidencia } from '@/services/requests/laudos/types';
import { TipoEvidenciaCartaControle } from '@/services/requests/cartas-controle/types';

const bucketName = 'evidencias';

export function generateFolderName(
  initialPath: string, // 'laudoCrm', 'divergencia'
  entityId: string, // laudoCrmId, divergenciaId, cartaControleId
  tipoEvidencia?: TipoEvidencia | TipoEvidenciaCartaControle | null,
): string {
  if (tipoEvidencia) {
    return `${bucketName}/${initialPath}/${entityId}/${tipoEvidencia}`;
  } else {
    return `${bucketName}/${initialPath}/${entityId}`;
  }
}
