
import { UserCheck, FileSpreadsheet, TrendingUp, Calendar, Users, PlusCircle } from 'lucide-react';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="semei-card animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="semei-stat-icon semei-stat-icon-purple">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Ações Rápidas</h3>
          <p className="text-sm text-slate-600 font-medium">Ferramentas do dia a dia</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProfessionalButton 
          variant="purple" 
          size="lg"
          icon={<UserCheck className="h-5 w-5" />}
          onClick={() => navigate('/atividades')}
          className="justify-start"
        >
          Chamada de Presença
        </ProfessionalButton>
        
        <ProfessionalButton 
          variant="yellow" 
          size="lg"
          icon={<FileSpreadsheet className="h-5 w-5" />}
          className="justify-start"
        >
          Gerar Relatórios
        </ProfessionalButton>
        
        <ProfessionalButton 
          variant="success" 
          size="lg"
          icon={<PlusCircle className="h-5 w-5" />}
          onClick={() => navigate('/idosos/novo')}
          className="justify-start"
        >
          Novo Cadastro
        </ProfessionalButton>
        
        <ProfessionalButton 
          variant="primary" 
          size="lg"
          icon={<Calendar className="h-5 w-5" />}
          onClick={() => navigate('/atividades')}
          className="justify-start"
        >
          Agendar Atividade
        </ProfessionalButton>
        
        <ProfessionalButton 
          variant="secondary" 
          size="lg"
          icon={<Users className="h-5 w-5" />}
          onClick={() => navigate('/idosos')}
          className="justify-start"
        >
          Gerenciar Idosos
        </ProfessionalButton>
        
        <ProfessionalButton 
          variant="ghost" 
          size="lg"
          icon={<TrendingUp className="h-5 w-5" />}
          className="justify-start"
        >
          Ver Estatísticas
        </ProfessionalButton>
      </div>
    </div>
  );
}
