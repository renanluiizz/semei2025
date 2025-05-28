
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

interface QuickActionsProps {
  onCheckIn: () => void;
  onGenerateReport: () => void;
  onViewIdosos: () => void;
  onViewActivities: () => void;
}

export function QuickActions({ onCheckIn, onGenerateReport, onViewIdosos, onViewActivities }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            onClick={onCheckIn} 
            className="w-full justify-start"
            size="lg"
          >
            <Users className="h-5 w-5 mr-3" />
            Chamada de Presença
          </Button>
          
          <Button 
            onClick={onViewActivities} 
            variant="outline" 
            className="w-full justify-start"
            size="lg"
          >
            <Calendar className="h-5 w-5 mr-3" />
            Ver Atividades
          </Button>
          
          <Button 
            onClick={onViewIdosos} 
            variant="outline" 
            className="w-full justify-start"
            size="lg"
          >
            <Users className="h-5 w-5 mr-3" />
            Gerenciar Idosos
          </Button>
          
          <Button 
            onClick={onGenerateReport} 
            variant="outline" 
            className="w-full justify-start"
            size="lg"
          >
            <FileText className="h-5 w-5 mr-3" />
            Gerar Relatórios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
