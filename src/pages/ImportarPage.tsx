
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImportSpreadsheet } from '@/components/ImportSpreadsheet';

export default function ImportarPage() {
  const navigate = useNavigate();
  const [importOpen, setImportOpen] = useState(true);

  const handleClose = () => {
    setImportOpen(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Importar Dados</h1>
        </div>

        {/* Conteúdo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Importação de Planilha</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Use esta funcionalidade para importar dados de idosos em massa através de planilhas Excel.
            </p>
            <Button 
              onClick={() => setImportOpen(true)}
              className="rounded-xl"
            >
              Iniciar Importação
            </Button>
          </CardContent>
        </Card>

        {/* Modal de Importação */}
        <ImportSpreadsheet 
          open={importOpen}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
