
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { tiposAtividadeHelpers, type TipoAtividade } from '@/lib/tiposAtividade';

export default function TiposAtividade() {
  const [novoTipo, setNovoTipo] = useState({ nome: '', descricao: '' });
  const [editingTipo, setEditingTipo] = useState<TipoAtividade | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();

  const { data: tiposAtividade, isLoading } = useQuery({
    queryKey: ['tipos-atividade'],
    queryFn: async () => {
      const { data, error } = await tiposAtividadeHelpers.getTiposAtividade();
      if (error) throw error;
      return data;
    },
  });

  const validateForm = (data: { nome: string; descricao?: string }, isEditing = false) => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (data.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (data.descricao && data.descricao.length > 500) {
      newErrors.descricao = 'Descrição deve ter no máximo 500 caracteres';
    }

    // Verificar duplicatas
    const exists = tiposAtividade?.some(tipo => 
      tipo.nome.toLowerCase() === data.nome.trim().toLowerCase() &&
      (!isEditing || tipo.id !== editingTipo?.id)
    );
    
    if (exists) {
      newErrors.nome = 'Já existe um tipo de atividade com este nome';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: { nome: string; descricao?: string }) => 
      tiposAtividadeHelpers.createTipoAtividade({
        nome: data.nome.trim(),
        descricao: data.descricao?.trim(),
        ativo: true
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade criado com sucesso!', {
        description: 'O novo tipo está disponível para uso.'
      });
      setNovoTipo({ nome: '', descricao: '' });
      setErrors({});
    },
    onError: (error: any) => {
      toast.error('Erro ao criar tipo de atividade', {
        description: error.message || 'Tente novamente em alguns instantes.'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; nome: string; descricao?: string }) =>
      tiposAtividadeHelpers.updateTipoAtividade(data.id, {
        nome: data.nome.trim(),
        descricao: data.descricao?.trim()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade atualizado com sucesso!');
      setEditingTipo(null);
      setErrors({});
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar tipo de atividade', {
        description: error.message || 'Tente novamente em alguns instantes.'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tiposAtividadeHelpers.deleteTipoAtividade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-atividade'] });
      toast.success('Tipo de atividade removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao remover tipo de atividade', {
        description: error.message || 'Este tipo pode estar sendo usado em atividades.'
      });
    }
  });

  const handleCreate = () => {
    if (!validateForm(novoTipo)) {
      toast.error('Corrija os erros no formulário', {
        description: 'Verifique os campos obrigatórios.'
      });
      return;
    }
    createMutation.mutate(novoTipo);
  };

  const handleUpdate = () => {
    if (!editingTipo || !validateForm({
      nome: editingTipo.nome,
      descricao: editingTipo.descricao
    }, true)) {
      toast.error('Corrija os erros no formulário');
      return;
    }
    updateMutation.mutate({
      id: editingTipo.id,
      nome: editingTipo.nome,
      descricao: editingTipo.descricao
    });
  };

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover o tipo "${nome}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tipos de Atividade</h1>
        <p className="text-gray-500 mt-1">
          Gerencie os tipos de atividades disponíveis no sistema
        </p>
      </div>

      {/* Formulário de Criação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Novo Tipo de Atividade
          </CardTitle>
          <CardDescription>
            Adicione um novo tipo de atividade ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Ex: Exercícios Físicos"
                value={novoTipo.nome}
                onChange={(e) => {
                  setNovoTipo(prev => ({ ...prev, nome: e.target.value }));
                  if (errors.nome) {
                    setErrors(prev => ({ ...prev, nome: '' }));
                  }
                }}
                className={`rounded-xl ${errors.nome ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.nome}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva brevemente este tipo de atividade..."
                value={novoTipo.descricao}
                onChange={(e) => {
                  setNovoTipo(prev => ({ ...prev, descricao: e.target.value }));
                  if (errors.descricao) {
                    setErrors(prev => ({ ...prev, descricao: '' }));
                  }
                }}
                className={`rounded-xl resize-none ${errors.descricao ? 'border-red-500' : ''}`}
                rows={3}
                disabled={isSubmitting}
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.descricao}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleCreate}
              disabled={isSubmitting || !novoTipo.nome.trim()}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tipo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Lista de Tipos Existentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tipos Cadastrados
          </CardTitle>
          <CardDescription>
            {tiposAtividade?.length || 0} tipos de atividade cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tiposAtividade && tiposAtividade.length > 0 ? (
            <div className="space-y-4">
              {tiposAtividade.map((tipo) => (
                <div key={tipo.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  {editingTipo?.id === tipo.id ? (
                    // Modo de edição
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edit-nome-${tipo.id}`}>Nome *</Label>
                          <Input
                            id={`edit-nome-${tipo.id}`}
                            value={editingTipo.nome}
                            onChange={(e) => {
                              setEditingTipo(prev => prev ? { ...prev, nome: e.target.value } : null);
                              if (errors.nome) {
                                setErrors(prev => ({ ...prev, nome: '' }));
                              }
                            }}
                            className={`rounded-xl ${errors.nome ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                          />
                          {errors.nome && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.nome}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`edit-descricao-${tipo.id}`}>Descrição</Label>
                          <Textarea
                            id={`edit-descricao-${tipo.id}`}
                            value={editingTipo.descricao || ''}
                            onChange={(e) => {
                              setEditingTipo(prev => prev ? { ...prev, descricao: e.target.value } : null);
                              if (errors.descricao) {
                                setErrors(prev => ({ ...prev, descricao: '' }));
                              }
                            }}
                            className={`rounded-xl resize-none ${errors.descricao ? 'border-red-500' : ''}`}
                            rows={2}
                            disabled={isSubmitting}
                          />
                          {errors.descricao && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTipo(null);
                            setErrors({});
                          }}
                          disabled={isSubmitting}
                          className="rounded-xl"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={isSubmitting || !editingTipo.nome.trim()}
                          className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        >
                          {updateMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Salvar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo de visualização
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{tipo.nome}</h3>
                          <Badge variant={tipo.ativo ? "default" : "secondary"} className="rounded-full">
                            {tipo.ativo ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ativo
                              </>
                            ) : (
                              'Inativo'
                            )}
                          </Badge>
                        </div>
                        {tipo.descricao && (
                          <p className="text-gray-600 text-sm mb-2">{tipo.descricao}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Criado em: {new Date(tipo.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTipo(tipo);
                            setErrors({});
                          }}
                          disabled={isSubmitting}
                          className="rounded-xl"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tipo.id, tipo.nome)}
                          disabled={isSubmitting}
                          className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum tipo de atividade cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece criando o primeiro tipo de atividade.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
