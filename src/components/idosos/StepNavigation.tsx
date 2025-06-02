
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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-200 ${
              isActive ? 'bg-blue-600 text-white shadow-lg scale-110' :
              isCompleted ? 'bg-green-500 text-white' :
              'bg-slate-200 text-slate-500'
            }`}>
              <Icon size={20} />
            </div>
            <span className={`text-sm font-medium transition-colors ${
              isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`hidden md:block absolute top-6 w-24 h-0.5 ml-24 transition-colors ${
                isCompleted ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
