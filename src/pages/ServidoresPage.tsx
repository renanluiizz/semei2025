
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModernTable, ModernTableRow, ModernTableCell } from '@/components/ui/modern-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingCard } from '@/components/ui/loading-card';
import { StaffForm } from '@/components/staff/StaffForm';
import { RoleGuard } from '@/components/security/RoleGuard';
import { staffManagementHelpers, StaffMember } from '@/lib/staffManagement';
import { ArrowLeft, Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ServidoresPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);

  // Query para buscar servidores
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ['staff', searchQuery, statusFilter],
    queryFn: async () => {
      if (searchQuery) {
        return staffManagementHelpers.searchStaff(searchQuery);
      } else {
        return staffManagementHelpers.filterStaffByStatus(statusFilter);
      }
    },
  });

  // Mutation para criar servidor
  const createMutation = useMutation({
    mutationFn: staffManagementHelpers.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowForm(false);
      toast.success('Servidor cadastrado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao cadastrar servidor: ${error.message}`);
    },
  });

  // Mutation para atualizar servidor
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      staffManagementHelpers.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setEditingStaff(null);
      toast.success('Servidor atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar servidor: ${error.message}`);
    },
  });

  // Mutation para deletar servidor
  const deleteMutation = useMutation({
    mutationFn: staffManagementHelpers.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setDeletingStaff(null);
      toast.success('Servidor removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover servidor: ${error.message}`);
    },
  });

  const handleCreateStaff = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateStaff = async (data: any) => {
    if (!editingStaff) return;
    await updateMutation.mutateAsync({ id: editingStaff.id, data });
  };

  const handleDeleteStaff = () => {
    if (!deletingStaff) return;
    deleteMutation.mutate(deletingStaff.id);
  };

  const staffList = staffData?.data || [];
  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  if (showForm || editingStaff) {
    return (
      <RoleGuard requiredRole="admin">
        <div className="space-y-6">
          <StaffForm
            staff={editingStaff || undefined}
            onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
            onCancel={() => {
              setShowForm(false);
              setEditingStaff(null);
            }}
            loading={isFormLoading}
          />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="semei-button-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestão de Servidores</h1>
              <p className="text-sm text-gray-600 mt-1">Gerencie usuários do sistema</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="semei-button-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Servidor
          </Button>
        </div>

        {/* Filtros */}
        <Card className="semei-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 semei-input"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="semei-input">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        {isLoading ? (
          <LoadingCard title={true} lines={5} />
        ) : error ? (
          <Card className="semei-card">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 mb-2">Erro ao carregar servidores</p>
              <p className="text-gray-500 text-sm">Tente recarregar a página</p>
            </CardContent>
          </Card>
        ) : (
          <ModernTable
            title={`Servidores Cadastrados (${staffList.length})`}
            headers={['Nome', 'E-mail', 'Cargo', 'Perfil', 'Status', 'Ações']}
          >
            {staffList.length === 0 ? (
              <ModernTableRow>
                <ModernTableCell className="text-center py-8" colSpan={6}>
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum servidor encontrado</p>
                </ModernTableCell>
              </ModernTableRow>
            ) : (
              staffList.map((staff) => (
                <ModernTableRow key={staff.id}>
                  <ModernTableCell>
                    <div>
                      <p className="font-medium text-gray-900">{staff.full_name}</p>
                      {staff.position && (
                        <p className="text-xs text-gray-500">{staff.position}</p>
                      )}
                    </div>
                  </ModernTableCell>
                  <ModernTableCell>
                    <p className="text-sm">{staff.email}</p>
                    {staff.phone && (
                      <p className="text-xs text-gray-500">{staff.phone}</p>
                    )}
                  </ModernTableCell>
                  <ModernTableCell>
                    <p className="text-sm">{staff.position || 'Não informado'}</p>
                  </ModernTableCell>
                  <ModernTableCell>
                    <StatusBadge status={staff.role === 'admin' ? 'success' : 'pending'}>
                      {staff.role === 'admin' ? 'Administrador' : 'Operador'}
                    </StatusBadge>
                  </ModernTableCell>
                  <ModernTableCell>
                    <StatusBadge status={staff.status === 'active' ? 'active' : 'inactive'}>
                      {staff.status === 'active' ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </ModernTableCell>
                  <ModernTableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingStaff(staff)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingStaff(staff)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </ModernTableCell>
                </ModernTableRow>
              ))
            )}
          </ModernTable>
        )}

        {/* Modal de confirmação de exclusão */}
        {deletingStaff && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Confirmar Exclusão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Tem certeza que deseja excluir o servidor <strong>{deletingStaff.full_name}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDeletingStaff(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteStaff}
                    disabled={deleteMutation.isPending}
                    className="flex-1"
                  >
                    {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
