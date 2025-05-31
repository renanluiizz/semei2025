
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuditLogViewer } from '@/components/security/AuditLogViewer';

export default function AuditoriaPage() {
  const navigate = useNavigate();

  return (
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Logs de Auditoria</h1>
            <p className="text-sm text-gray-600 mt-1">Monitore todas as ações realizadas no sistema</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <AuditLogViewer />
    </div>
  );
}
