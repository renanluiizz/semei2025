
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResetStatistics } from '@/components/ResetStatistics';

export default function ResetarPage() {
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(true);

  const handleClose = () => {
    setResetOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Resetar Estatísticas</h1>
        </div>

        {/* Conteúdo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reset de Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Use esta funcionalidade para resetar todas as estatísticas do sistema, mantendo os cadastros de idosos.
            </p>
            <Button 
              onClick={() => setResetOpen(true)}
              variant="destructive"
              className="rounded-xl"
            >
              Resetar Estatísticas
            </Button>
          </CardContent>
        </Card>

        {/* Modal de Reset */}
        <ResetStatistics 
          open={resetOpen}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
