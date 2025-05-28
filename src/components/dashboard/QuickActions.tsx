
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Users, Activity } from 'lucide-react';

interface QuickActionsProps {
  onCheckIn: () => void;
  onGenerateReport: () => void;
  onViewIdosos: () => void;
  onViewActivities: () => void;
}

export function QuickActions({ onCheckIn, onGenerateReport, onViewIdosos, onViewActivities }: QuickActionsProps) {
  const actions = [
    {
      icon: Clock,
      label: 'Check-in Rápido',
      description: 'Registrar presença',
      onClick: onCheckIn,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: FileText,
      label: 'Gerar Relatório',
      description: 'Criar PDF/Excel',
      onClick: onGenerateReport,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Users,
      label: 'Ver Idosos',
      description: 'Lista completa',
      onClick: onViewIdosos,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Activity,
      label: 'Atividades',
      description: 'Gerenciar agenda',
      onClick: onViewActivities,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2`}
            variant="default"
          >
            <action.icon className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-sm">{action.label}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
