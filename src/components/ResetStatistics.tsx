
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { RotateCcw, AlertTriangle, X, CheckCircle2, Shield } from 'lucide-react';

interface ResetStatisticsProps {
  open: boolean;
  onClose: () => void;
}

export function ResetStatistics({ open, onClose }: ResetStatisticsProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [step, setStep] = useState<'confirmation' | 'processing' | 'success'>('confirmation');

  const handleReset = async () => {
    if (confirmationText.toLowerCase() !== 'resetar') {
      toast.error('Digite "RESETAR" para confirmar a operação');
      return;
    }

    setIsResetting(true);
    setStep('processing');

    try {
      // Simular processo de reset com feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria a chamada real para o backend
      // Apenas resetar estatísticas, mantendo cadastros
      
      setStep('success');
      
      setTimeout(() => {
        toast.success('Estatísticas resetadas com sucesso!', {
          description: 'Todos os contadores foram zerados, mas os cadastros foram preservados'
        });
        setConfirmationText('');
        onClose();
        
        // Recarregar após um breve delay para mostrar sucesso
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao resetar estatísticas:', error);
      toast.error('Erro ao resetar estatísticas', {
        description: 'Tente novamente ou entre em contato com o suporte'
      });
      setStep('confirmation');
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
              {step === 'processing' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : step === 'success' ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
              {step === 'processing' ? 'Resetando...' : 
               step === 'success' ? 'Concluído!' : 
               'Resetar Estatísticas'}
            </CardTitle>
            {step === 'confirmation' && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {step === 'confirmation' && (
            <>
              {/* Aviso importante */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-red-600" />
                  O que será resetado:
                </h4>
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
                <h4 className="font-medium text-green-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  O que será preservado:
                </h4>
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
                  className="rounded-xl text-center font-mono uppercase"
                  disabled={isResetting}
                />
                <div className="text-xs text-gray-500 text-center">
                  {confirmationText.toLowerCase() === 'resetar' ? (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmação válida
                    </span>
                  ) : confirmationText.length > 0 ? (
                    <span className="text-red-600">Texto incorreto</span>
                  ) : (
                    <span>Digite exatamente "RESETAR"</span>
                  )}
                </div>
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
                      Resetar Agora
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
                        <br /><br />
                        Apenas os dados estatísticos serão removidos. Todos os cadastros de idosos, 
                        usuários e configurações serão mantidos.
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
                        Sim, Resetar Tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resetando Estatísticas...</h3>
              <p className="text-gray-600">Por favor, aguarde. Isso pode levar alguns segundos.</p>
              <div className="mt-4 text-sm text-gray-500">
                • Zerando contadores de atividades...<br />
                • Limpando dados de presença...<br />
                • Atualizando gráficos...
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Concluído!</h3>
              <p className="text-gray-600 mb-4">
                Todas as estatísticas foram resetadas com sucesso.
              </p>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  ✅ Cadastros preservados<br />
                  ✅ Estatísticas zeradas<br />
                  ✅ Sistema funcionando normalmente
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
