
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingCard } from '@/components/ui/loading-card';
import { StaffForm } from '@/components/staff/StaffForm';
import { RoleGuard } from '@/components/security/RoleGuard';
import { staffManagementHelpers, StaffMember } from '@/lib/staffManagement';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Users, 
  UserCheck, 
  UserX,
  Shield,
  Mail,
  Phone,
  Filter
} from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <UserCheck className="w-3 h-3 mr-1" />
          Ativo
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <UserX className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Shield className="w-3 h-3 mr-1" />
          Administrador
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        <Users className="w-3 h-3 mr-1" />
        Operador
      </Badge>
    );
  };

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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/dashboard')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestão de Servidores</h1>
                <p className="text-blue-100 mt-2">Gerencie usuários e permissões do sistema</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 h-auto shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Servidor
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, e-mail ou cargo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="w-full lg:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Apenas Ativos</SelectItem>
                    <SelectItem value="inactive">Apenas Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Servidores */}
        {isLoading ? (
          <LoadingCard title={true} lines={5} />
        ) : error ? (
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar servidores</h3>
              <p className="text-gray-500">Tente recarregar a página ou entre em contato com o suporte</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Servidores Cadastrados ({staffList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {staffList.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum servidor encontrado</h3>
                  <p className="text-gray-500 mb-6">Comece cadastrando o primeiro servidor do sistema</p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Servidor
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {staff.full_name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {getRoleBadge(staff.role)}
                                {getStatusBadge(staff.status)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{staff.email}</span>
                            </div>
                            {staff.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{staff.phone}</span>
                              </div>
                            )}
                            {staff.position && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{staff.position}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStaff(staff)}
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingStaff(staff)}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de confirmação de exclusão */}
        {deletingStaff && (
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
                  <strong className="text-gray-900">{deletingStaff.full_name}</strong>?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ Esta ação não pode ser desfeita e removerá permanentemente o acesso do usuário.
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
