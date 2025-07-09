
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleGuard } from '@/components/security/RoleGuard';
import { StaffForm } from '@/components/staff/StaffForm';
import { ServidoresHeader } from '@/components/servidores/ServidoresHeader';
import { ServidoresFilters } from '@/components/servidores/ServidoresFilters';
import { ServidoresList } from '@/components/servidores/ServidoresList';
import { DeleteConfirmationModal } from '@/components/servidores/DeleteConfirmationModal';
import { staffManagementHelpers, StaffMember } from '@/lib/staffManagement';
import { toast } from 'sonner';

export default function ServidoresPage() {
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

  // Mutations
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

  // Handlers
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
        <ServidoresHeader onNewStaff={() => setShowForm(true)} />
        
        <ServidoresFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <ServidoresList
          staffList={staffList}
          isLoading={isLoading}
          error={error}
          onEdit={setEditingStaff}
          onDelete={setDeletingStaff}
          onNewStaff={() => setShowForm(true)}
        />

        <DeleteConfirmationModal
          staff={deletingStaff}
          onConfirm={handleDeleteStaff}
          onCancel={() => setDeletingStaff(null)}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </RoleGuard>
  );
}
