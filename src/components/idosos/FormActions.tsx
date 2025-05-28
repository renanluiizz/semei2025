
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 0}
      >
        Anterior
      </Button>

      {isLastStep ? (
        <div className="space-y-4">
          {userProfile && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Responsável pelo cadastro:</strong> {userProfile.full_name}
              </p>
            </div>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={onNextStep}
        >
          Próximo
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
