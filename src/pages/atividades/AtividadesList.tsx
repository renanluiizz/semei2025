
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Plus, Trash2, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { NovaAtividadeDialog } from '@/components/atividades/NovaAtividadeDialog';
import type { Atividade } from '@/types/models';

export function AtividadesList() {
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; atividade?: Atividade }>({
    open: false
  });
  const [novaAtividadeOpen, setNovaAtividadeOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: atividades, isLoading } = useQuery({
    queryKey: ['atividades'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAtividades();
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dbHelpers.deleteAtividade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      toast.success('Atividade excluída com sucesso!');
      setDeleteDialog({ open: false });
    },
    onError: () => {
      toast.error('Erro ao excluir atividade');
    }
  });

  const handleDelete = (atividade: Atividade) => {
    setDeleteDialog({ open: true, atividade });
  };

  const confirmDelete = () => {
    if (deleteDialog.atividade) {
      deleteMutation.mutate(deleteDialog.atividade.id);
    }
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      social: 'bg-blue-100 text-blue-800',
      saude: 'bg-red-100 text-red-800',
      educacional: 'bg-green-100 text-green-800',
      lazer: 'bg-purple-100 text-purple-800',
      outros: 'bg-gray-100 text-gray-800',
    };
    return colors[tipo as keyof typeof colors] || colors.outros;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-500 mt-1">
            Gerencie as atividades dos idosos
          </p>
        </div>
        <Button onClick={() => setNovaAtividadeOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {atividades?.length || 0} atividades encontradas
        </p>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {atividades && atividades.length > 0 ? (
          atividades.map((atividade: Atividade) => (
            <Card key={atividade.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {atividade.activity_type}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getTipoColor(atividade.activity_type)}>
                              {atividade.activity_type}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(atividade.check_in_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700">{atividade.observation || 'Sem observações'}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span className="font-medium">Idoso:</span>
                          <span className="ml-1">{atividade.elder?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span className="font-medium">Staff ID:</span>
                          <span className="ml-1">{atividade.staff_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(atividade)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma atividade encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                Comece cadastrando a primeira atividade.
              </p>
              <Button onClick={() => setNovaAtividadeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Atividade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Nova Atividade Dialog */}
      <NovaAtividadeDialog 
        open={novaAtividadeOpen} 
        onOpenChange={setNovaAtividadeOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a atividade "{deleteDialog.atividade?.activity_type}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
