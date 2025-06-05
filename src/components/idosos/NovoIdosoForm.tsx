
import { useState } from 'react';
import { User, MapPin, Heart, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StepNavigation } from '@/components/idosos/StepNavigation';
import { PersonalDataStep } from '@/components/idosos/PersonalDataStep';
import { AddressStep } from '@/components/idosos/AddressStep';
import { HealthStep } from '@/components/idosos/HealthStep';
import { ContactsStep } from '@/components/idosos/ContactsStep';
import { FormActions } from '@/components/idosos/FormActions';
import { useIdosoForm } from '@/hooks/useIdosoForm';

const steps = [
  { id: 'pessoais', title: 'Dados Pessoais', icon: User },
  { id: 'endereco', title: 'Endereço', icon: MapPin },
  { id: 'saude', title: 'Saúde', icon: Heart },
  { id: 'contatos', title: 'Contatos', icon: Phone },
];

export function NovoIdosoForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { form, createMutation, onSubmit, userProfile } = useIdosoForm();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDataStep form={form} />;
      case 1:
        return <AddressStep form={form} />;
      case 2:
        return <HealthStep form={form} />;
      case 3:
        return <ContactsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <Card className="modern-card">
      <CardContent className="p-8">
        <StepNavigation steps={steps} currentStep={currentStep} />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/60">
            {renderStepContent()}
          </div>
          
          <FormActions
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            isSubmitting={createMutation.isPending}
            userProfile={userProfile}
          />
        </form>
      </CardContent>
    </Card>
  );
}
