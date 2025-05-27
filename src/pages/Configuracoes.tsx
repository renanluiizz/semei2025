
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Settings, User, Shield, Bell, Palette } from 'lucide-react';

export default function Configuracoes() {
  const { userProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    toast.info('Exportação de dados iniciada...');
  };

  const handleImportData = () => {
    toast.info('Importação de dados não implementada ainda.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">
          Gerencie as configurações do sistema e sua conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={userProfile?.full_name || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                value={userProfile?.role === 'admin' ? 'Administrador' : 'Operador'}
                disabled
                className="bg-gray-50"
              />
            </div>

            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Preferências do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferências do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tema Escuro</Label>
                <p className="text-sm text-gray-500">
                  Ativar modo escuro na interface
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Salvamento Automático</Label>
                <p className="text-sm text-gray-500">
                  Salvar dados automaticamente
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações</Label>
                <p className="text-sm text-gray-500">
                  Receber notificações do sistema
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Último Login</Label>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Visualizar Log de Atividades
              </Button>
              <Button variant="outline" className="w-full">
                Configurar Autenticação 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dados e Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Dados e Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Gerenciamento de Dados</Label>
              <p className="text-sm text-gray-500 mb-4">
                Exporte ou importe dados do sistema
              </p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleExportData}
                >
                  Exportar Dados
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleImportData}
                >
                  Importar Dados
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-red-600">Zona de Perigo</Label>
              <p className="text-sm text-gray-500 mb-4">
                Ações irreversíveis
              </p>
              
              <Button variant="destructive" className="w-full">
                Excluir Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
