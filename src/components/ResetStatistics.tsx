
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetStatisticsProps {
  open: boolean;
  onClose: () => void;
}

export function ResetStatistics({ open, onClose }: ResetStatisticsProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (confirmationText.toLowerCase() !== 'resetar') {
      toast.error('Digite "RESETAR" para confirmar a operação');
      return;
    }

    setIsResetting(true);

    try {
      // Simular reset das estatísticas
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria a chamada real para o backend para resetar apenas estatísticas
      // mantendo os cadastros de idosos, usuários e atividades
      
      toast.success('Estatísticas resetadas com sucesso!');
      setConfirmationText('');
      onClose();
      
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao resetar estatísticas:', error);
      toast.error('Erro ao resetar estatísticas');
    } finally {
      setIsResetting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 semei-card">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-6 w-6" />
              Resetar Estatísticas
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Aviso importante */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-900 mb-2">⚠️ ATENÇÃO: Operação Irreversível</p>
                <div className="text-red-700 space-y-1">
                  <p>• Todos os contadores e gráficos serão zerados</p>
                  <p>• Dados de check-ins e atividades serão removidos</p>
                  <p>• Cadastros de idosos e usuários serão preservados</p>
                  <p>• Esta ação NÃO pode ser desfeita</p>
                </div>
              </div>
            </div>
          </div>

          {/* O que será resetado */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">O que será resetado:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Estatísticas do dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Gráficos de atividades</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Histórico de check-ins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Contadores de presença</span>
              </div>
            </div>
          </div>

          {/* O que será preservado */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-900">O que será preservado:</h4>
            <div className="space-y-2 text-sm text-green-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cadastros de idosos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Contas de usuários</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Tipos de atividades</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Configurações do sistema</span>
              </div>
            </div>
          </div>

          {/* Campo de confirmação */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Para confirmar, digite <strong>"RESETAR"</strong> abaixo:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Digite RESETAR para confirmar"
              className="rounded-xl text-center font-mono"
              disabled={isResetting}
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 rounded-xl"
              disabled={isResetting}
            >
              Cancelar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex-1 rounded-xl"
                  disabled={confirmationText.toLowerCase() !== 'resetar' || isResetting}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isResetting ? 'Resetando...' : 'Resetar Agora'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Confirmação Final
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Você tem certeza absoluta que deseja resetar todas as estatísticas?
                    <br /><br />
                    <strong>Esta ação é irreversível e não pode ser desfeita.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 rounded-xl"
                    disabled={isResetting}
                  >
                    {isResetting ? 'Resetando...' : 'Sim, Resetar Tudo'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
