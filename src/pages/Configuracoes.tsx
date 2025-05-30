
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImportSpreadsheet } from '@/components/ImportSpreadsheet';
import { ResetStatistics } from '@/components/ResetStatistics';
import { toast } from 'sonner';
import { 
  Settings, 
  FileSpreadsheet, 
  RotateCcw, 
  Shield, 
  Download,
  Upload,
  Database,
  Users,
  Activity
} from 'lucide-react';

export function Configuracoes() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleExportAllData = () => {
    // Simular exportação de todos os dados
    toast.success('Exportação de dados iniciada! O arquivo será baixado em instantes.');
  };

  const configCards = [
    {
      title: 'Importar Planilha',
      description: 'Importe dados de idosos em lote através de planilha Excel',
      icon: FileSpreadsheet,
      color: 'from-blue-500 to-blue-600',
      action: () => setShowImportDialog(true),
      buttonText: 'Importar Dados',
      buttonIcon: Upload
    },
    {
      title: 'Resetar Estatísticas',
      description: 'Zere contadores e gráficos mantendo os cadastros',
      icon: RotateCcw,
      color: 'from-red-500 to-red-600',
      action: () => setShowResetDialog(true),
      buttonText: 'Resetar Agora',
      buttonIcon: RotateCcw,
      destructive: true
    },
    {
      title: 'Exportar Dados',
      description: 'Baixe uma cópia completa de todos os dados do sistema',
      icon: Download,
      color: 'from-green-500 to-green-600',
      action: handleExportAllData,
      buttonText: 'Exportar Tudo',
      buttonIcon: Download
    }
  ];

  const systemStats = [
    { label: 'Total de Idosos', value: '156', icon: Users, color: 'text-blue-600' },
    { label: 'Total de Atividades', value: '1,247', icon: Activity, color: 'text-green-600' },
    { label: 'Usuários do Sistema', value: '8', icon: Shield, color: 'text-purple-600' },
    { label: 'Banco de Dados', value: '2.4 MB', icon: Database, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Configurações do Sistema
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Gerenciamento e configurações da SEMEI
          </p>
        </div>
      </div>

      {/* Estatísticas do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="semei-card border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards de Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {configCards.map((card) => (
          <Card key={card.title} className="semei-card hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
              <CardDescription className="text-gray-600">
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={card.action}
                variant={card.destructive ? "destructive" : "default"}
                className={`w-full semei-button ${
                  card.destructive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'
                } text-white`}
                size="lg"
              >
                <card.buttonIcon className="h-5 w-5 mr-2" />
                {card.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações do Sistema */}
      <Card className="semei-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Sistema</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium">SEMEI - Sistema de Gestão</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Suporte</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">suporte@semei.gov.br</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">(21) 3333-4444</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">8h às 17h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avisos Importantes */}
      <Card className="semei-card border-l-4 border-l-yellow-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Avisos Importantes</h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>• Faça backup dos dados antes de realizar operações de reset</p>
                <p>• A importação de planilhas deve seguir o modelo oficial</p>
                <p>• Apenas administradores podem acessar estas configurações</p>
                <p>• Mantenha o sistema sempre atualizado para melhor segurança</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ImportSpreadsheet 
        open={showImportDialog} 
        onClose={() => setShowImportDialog(false)} 
      />
      
      <ResetStatistics 
        open={showResetDialog} 
        onClose={() => setShowResetDialog(false)} 
      />
    </div>
  );
}
