
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/lib/staffManagement';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  staff: StaffMember | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  staff,
  onConfirm,
  onCancel,
  isDeleting
}: DeleteConfirmationModalProps) {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-md w-full shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-600">Confirmar Exclusão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">
            Tem certeza que deseja excluir o servidor{' '}
            <strong className="text-gray-900">{staff.full_name}</strong>?
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            ⚠️ Esta ação não pode ser desfeita e removerá permanentemente o acesso do usuário.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
