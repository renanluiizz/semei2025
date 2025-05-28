
import { LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
}

export function StepNavigation({ steps, currentStep }: StepNavigationProps) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              isActive ? 'bg-primary text-primary-foreground' :
              isCompleted ? 'bg-green-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              <Icon size={20} />
            </div>
            <span className={`text-sm font-medium ${
              isActive ? 'text-primary' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
