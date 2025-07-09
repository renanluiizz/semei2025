
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServidoresHeaderProps {
  onNewStaff: () => void;
}

export function ServidoresHeader({ onNewStaff }: ServidoresHeaderProps) {
  const navigate = useNavigate();

  return (
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
          onClick={onNewStaff}
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 h-auto shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Servidor
        </Button>
      </div>
    </div>
  );
}
