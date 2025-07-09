
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingCard } from '@/components/ui/loading-card';
import { StaffMember } from '@/lib/staffManagement';
import { 
  Users, 
  UserCheck, 
  UserX,
  Shield,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';

interface ServidoresListProps {
  staffList: StaffMember[];
  isLoading: boolean;
  error: any;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onNewStaff: () => void;
}

export function ServidoresList({
  staffList,
  isLoading,
  error,
  onEdit,
  onDelete,
  onNewStaff
}: ServidoresListProps) {
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

  if (isLoading) {
    return <LoadingCard showTitle={true} lines={5} />;
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar servidores</h3>
          <p className="text-gray-500">Tente recarregar a página ou entre em contato com o suporte</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            <Button onClick={onNewStaff} className="bg-blue-600 hover:bg-blue-700">
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
                      onClick={() => onEdit(staff)}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(staff)}
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
  );
}
