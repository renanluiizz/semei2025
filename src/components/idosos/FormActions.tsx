
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { Usuario } from '@/types/models';

interface FormActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isSubmitting: boolean;
  userProfile?: Usuario;
}

export function FormActions({ 
  currentStep, 
  totalSteps, 
  onPrevStep, 
  onNextStep, 
  isSubmitting,
  userProfile 
}: FormActionsProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-slate-200/60">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 0}
        className="rounded-xl"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Anterior
      </Button>

      <div className="flex items-center gap-4">
        {isLastStep && userProfile && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Responsável:</strong> {userProfile.full_name}
            </p>
          </div>
        )}
        
        {isLastStep ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="modern-btn-primary rounded-xl px-8"
          >
            {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNextStep}
            className="modern-btn-primary rounded-xl"
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
