
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Activity, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TipoAtividade {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
}

export function TiposAtividade() {
  const [editingTipo, setEditingTipo] = useState<TipoAtividade | null>(null);
  const [novoTipo, setNovoTipo] = useState({ nome: '', descricao: '' });
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const queryClient = useQueryClient();

  // Simulação de dados - substituir por chamada real ao Supabase
  const { data: tiposAtividade = [], isLoading } = useQuery({
    queryKey: ['tipos-atividade'],
    queryFn: async () => {
      return [
        { id: '1', nome: 'Fisioterapia', descricao: 'Exercícios fisioterapêuticos', ativo: true, created_at: new Date().toISOString() },
        { id: '2', nome: 'Terapia Ocupacional', descricao: 'Atividades terapêuticas ocupacionais', ativo: true, created_at: new Date().toISOString() },
        { id: '3', nome: 'Recreação', descricao: 'Atividades recreativas e de lazer', ativo: true, created_at: new Date().toISOString() },
        { id: '4', nome: 'Alimentação', descricao: 'Horário das refeições', ativo: true, created_at: new Date().toISOString() },
        { id: '5', nome: 'Bingo', descricao: 'Jogos de bingo recreativos', ativo: true, created_at: new Date().toISOString() },
        { id: '6', nome: 'Caminhada', descricao: 'Exercícios de caminhada orientada', ativo: true, created_at: new Date().toISOString() },
      ] as TipoAtividade[];
    },
  });

  const validateForm = (data: { nome: string; descricao: string }, isEditing = false) => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (data.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (data.nome.trim().length > 50) {
      newErrors.nome = 'Nome deve ter no máximo 50 caracteres';
    }
    
    // Verificar duplicatas (exceto quando editando o mesmo item)
    const isDuplicate = tiposAtividade.some(tipo => 
      tipo.nome.toLowerCase() === data.nome.trim().toLowerCase() && 
      (!isEditing || tipo.id !== editingTipo?.id)
    );
    
    if (isDuplicate) {
      newErrors.nome = 'Já existe um tipo de atividade com este nome';
    }
    
    if (data.descricao && data.descricao.length > 200) {
      newErrors.descricao = 'Descrição deve ter no máximo 200 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: async (data: { nome: string; descricao: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now().toString(), ...data, ativo: true, created_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade criado com sucesso!', {
        description: `"${novoTipo.nome}" foi adicionado ao sistema`
      });
      setNovoTipo({ nome: '', descricao: '' });
      setShowNewDialog(false);
      setErrors({});
    },
    onError: () => {
      toast.error('Erro ao criar tipo de atividade', {
        description: 'Tente novamente ou entre em contato com o suporte'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; nome: string; descricao: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade atualizado com sucesso!', {
        description: `"${editingTipo?.nome}" foi modificado`
      });
      setEditingTipo(null);
      setShowEditDialog(false);
      setErrors({});
    },
    onError: () => {
      toast.error('Erro ao atualizar tipo de atividade', {
        description: 'Tente novamente ou entre em contato com o suporte'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: (_, deletedId) => {
      const deletedTipo = tiposAtividade.find(tipo => tipo.id === deletedId);
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade excluído com sucesso!', {
        description: `"${deletedTipo?.nome}" foi removido do sistema`
      });
    },
    onError: () => {
      toast.error('Erro ao excluir tipo de atividade', {
        description: 'Verifique se não há atividades vinculadas a este tipo'
      });
    }
  });

  const handleCreate = () => {
    if (!validateForm(novoTipo)) {
      toast.error('Corrija os erros no formulário');
      return;
    }
    createMutation.mutate(novoTipo);
  };

  const handleUpdate = () => {
    if (!editingTipo || !validateForm(editingTipo, true)) {
      toast.error('Corrija os erros no formulário');
      return;
    }
    updateMutation.mutate({
      id: editingTipo.id,
      nome: editingTipo.nome.trim(),
      descricao: editingTipo.descricao?.trim() || ''
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tipos de Atividade</h1>
            <p className="text-gray-500 mt-1">Gerencie os tipos de atividade disponíveis no sistema</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header melhorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tipos de Atividade</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Gerencie os tipos de atividade disponíveis no sistema
          </p>
          <div className="mt-2 text-sm text-gray-600">
            Total: <span className="font-semibold">{tiposAtividade.length}</span> tipos cadastrados
          </div>
        </div>
        
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button className="semei-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo de Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Tipo de Atividade</DialogTitle>
              <DialogDescription>
                Crie um novo tipo de atividade para o sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoTipo.nome}
                  onChange={(e) => {
                    setNovoTipo(prev => ({ ...prev, nome: e.target.value }));
                    if (errors.nome) setErrors(prev => ({ ...prev, nome: '' }));
                  }}
                  placeholder="Ex: Bingo, Caminhada, Oficina..."
                  className={`rounded-xl ${errors.nome ? 'border-red-500' : ''}`}
                  maxLength={50}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.nome}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {novoTipo.nome.length}/50 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={novoTipo.descricao}
                  onChange={(e) => {
                    setNovoTipo(prev => ({ ...prev, descricao: e.target.value }));
                    if (errors.descricao) setErrors(prev => ({ ...prev, descricao: '' }));
                  }}
                  placeholder="Descrição opcional..."
                  className={`rounded-xl ${errors.descricao ? 'border-red-500' : ''}`}
                  maxLength={200}
                />
                {errors.descricao && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.descricao}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {novoTipo.descricao.length}/200 caracteres
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewDialog(false);
                  setNovoTipo({ nome: '', descricao: '' });
                  setErrors({});
                }} 
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={createMutation.isPending} 
                className="semei-button bg-gradient-to-r from-primary to-secondary text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de tipos melhorada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tiposAtividade.map((tipo) => (
          <Card key={tipo.id} className="semei-card hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base md:text-lg font-semibold truncate">{tipo.nome}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Criado em {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {tipo.descricao && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tipo.descricao}</p>
              )}
              
              <div className="flex gap-2">
                <Dialog open={showEditDialog && editingTipo?.id === tipo.id} onOpenChange={(open) => {
                  setShowEditDialog(open);
                  if (!open) {
                    setEditingTipo(null);
                    setErrors({});
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTipo({ ...tipo })}
                      className="flex-1 rounded-xl border-primary/20 hover:bg-primary/5"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Editar Tipo de Atividade</DialogTitle>
                      <DialogDescription>
                        Modifique as informações do tipo de atividade
                      </DialogDescription>
                    </DialogHeader>
                    {editingTipo && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-nome">Nome *</Label>
                          <Input
                            id="edit-nome"
                            value={editingTipo.nome}
                            onChange={(e) => {
                              setEditingTipo(prev => prev ? ({ ...prev, nome: e.target.value }) : null);
                              if (errors.nome) setErrors(prev => ({ ...prev, nome: '' }));
                            }}
                            className={`rounded-xl ${errors.nome ? 'border-red-500' : ''}`}
                            maxLength={50}
                          />
                          {errors.nome && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.nome}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {editingTipo.nome.length}/50 caracteres
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="edit-descricao">Descrição</Label>
                          <Input
                            id="edit-descricao"
                            value={editingTipo.descricao || ''}
                            onChange={(e) => {
                              setEditingTipo(prev => prev ? ({ ...prev, descricao: e.target.value }) : null);
                              if (errors.descricao) setErrors(prev => ({ ...prev, descricao: '' }));
                            }}
                            className={`rounded-xl ${errors.descricao ? 'border-red-500' : ''}`}
                            maxLength={200}
                          />
                          {errors.descricao && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.descricao}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {(editingTipo.descricao || '').length}/200 caracteres
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowEditDialog(false)} 
                        className="rounded-xl"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleUpdate} 
                        disabled={updateMutation.isPending} 
                        className="semei-button bg-gradient-to-r from-primary to-secondary text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl border-red-200 hover:bg-red-50 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Confirmar Exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o tipo de atividade "<strong>{tipo.nome}</strong>"? 
                        <br /><br />
                        Esta ação não pode ser desfeita e pode afetar atividades já cadastradas.
                        Verifique se não há atividades vinculadas antes de prosseguir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(tipo.id)}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tiposAtividade.length === 0 && (
        <Card className="semei-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum tipo de atividade cadastrado</h3>
            <p className="text-gray-500 text-center mb-6">
              Comece criando tipos de atividade para organizar melhor o sistema
            </p>
            <Button 
              onClick={() => setShowNewDialog(true)}
              className="semei-button bg-gradient-to-r from-primary to-secondary text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Tipo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
