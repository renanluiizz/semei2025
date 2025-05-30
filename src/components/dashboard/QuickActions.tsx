
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, Activity, Zap } from 'lucide-react';

interface QuickActionsProps {
  onCheckIn: () => void;
  onGenerateReport: () => void;
  onViewIdosos: () => void;
  onViewActivities: () => void;
}

export function QuickActions({ onCheckIn, onGenerateReport, onViewIdosos, onViewActivities }: QuickActionsProps) {
  return (
    <Card className="semei-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            onClick={onCheckIn} 
            className="w-full justify-start semei-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            size="lg"
          >
            <Users className="h-5 w-5 mr-3" />
            Chamada de Presença
          </Button>
          
          <Button 
            onClick={onViewActivities} 
            variant="outline" 
            className="w-full justify-start rounded-xl border-primary/20 hover:bg-primary/5 hover:border-primary/40"
            size="lg"
          >
            <Calendar className="h-5 w-5 mr-3" />
            Ver Atividades
          </Button>
          
          <Button 
            onClick={onViewIdosos} 
            variant="outline" 
            className="w-full justify-start rounded-xl border-secondary/20 hover:bg-secondary/5 hover:border-secondary/40"
            size="lg"
          >
            <Users className="h-5 w-5 mr-3" />
            Gerenciar Idosos
          </Button>
          
          <Button 
            onClick={onGenerateReport} 
            variant="outline" 
            className="w-full justify-start rounded-xl border-accent/20 hover:bg-accent/5 hover:border-accent/40"
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
