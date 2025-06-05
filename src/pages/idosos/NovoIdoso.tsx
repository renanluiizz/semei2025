
import { NovoIdosoHeader } from '@/components/idosos/NovoIdosoHeader';
import { NovoIdosoForm } from '@/components/idosos/NovoIdosoForm';

export function NovoIdoso() {
  return (
    <div className="space-y-6">
      <NovoIdosoHeader />
      <NovoIdosoForm />
    </div>
  );
}
