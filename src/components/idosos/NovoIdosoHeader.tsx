
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NovoIdosoHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => navigate('/idosos')} className="rounded-xl">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cadastrar Novo Idoso</h1>
        <p className="text-slate-600 mt-1">Preencha os dados para cadastrar um novo idoso</p>
      </div>
    </div>
  );
}
