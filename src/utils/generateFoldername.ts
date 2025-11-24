import { TipoEvidenciaCartaControle } from '@/services/requests/cartas-controle/types';
import { TipoEvidencia } from '@/services/requests/laudos/types';

export function generateFolderName(
  initialPath: string, // 'laudoCrm', 'divergencia'
  entityId: string, // laudoCrmId, divergenciaId, cartaControleId
  tipoEvidencia?: TipoEvidencia | TipoEvidenciaCartaControle | null,
  userId?: string,
  isAvatar = false,
): string {
  const bucketName = isAvatar ? 'avatars' : 'evidencias';

  if (isAvatar) {
    return `${bucketName}/${userId}`;
  }

  if (tipoEvidencia) {
    return `${bucketName}/${initialPath}/${entityId}/${tipoEvidencia}`;
  } else {
    return `${bucketName}/${initialPath}/${entityId}`;
  }
}
