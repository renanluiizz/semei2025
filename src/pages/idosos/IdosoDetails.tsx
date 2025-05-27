
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Calendar, Phone, Heart, MapPin, FileText, User } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageLoading } from '@/components/ui/page-loading';

export default function IdosoDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: idoso, isLoading, error } = useQuery({
    queryKey: ['idoso', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      const { data, error } = await dbHelpers.getIdoso(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !idoso) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/idosos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Idoso não encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              O idoso solicitado não foi encontrado ou pode ter sido removido.
            </p>
            <Link to="/idosos">
              <Button>Voltar à Lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/idosos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{idoso.name}</h1>
            <p className="text-gray-500 mt-1">
              Informações detalhadas do idoso
            </p>
          </div>
        </div>
        <Link to={`/idosos/${id}/editar`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <p className="text-gray-900">{idoso.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Idade</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{getAge(idoso.birth_date)} anos</p>
                  <Badge variant="secondary">{idoso.gender}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                <p className="text-gray-900">
                  {format(new Date(idoso.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            {idoso.birthplace && (
              <div>
                <label className="text-sm font-medium text-gray-500">Naturalidade</label>
                <p className="text-gray-900">{idoso.birthplace}</p>
              </div>
            )}

            {idoso.marital_status && (
              <div>
                <label className="text-sm font-medium text-gray-500">Estado Civil</label>
                <p className="text-gray-900">{idoso.marital_status}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {idoso.father_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome do Pai</label>
                  <p className="text-gray-900">{idoso.father_name}</p>
                </div>
              )}
              {idoso.mother_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome da Mãe</label>
                  <p className="text-gray-900">{idoso.mother_name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documentação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p className="text-gray-900 font-mono">{idoso.cpf}</p>
            </div>
            
            {idoso.rg && (
              <div>
                <label className="text-sm font-medium text-gray-500">RG</label>
                <p className="text-gray-900 font-mono">{idoso.rg}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {idoso.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Endereço</label>
                <p className="text-gray-900">{idoso.address}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {idoso.neighborhood && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Bairro</label>
                  <p className="text-gray-900">{idoso.neighborhood}</p>
                </div>
              )}
              {idoso.state && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <p className="text-gray-900">{idoso.state}</p>
                </div>
              )}
            </div>

            {idoso.zone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Zona</label>
                <Badge variant="outline">{idoso.zone}</Badge>
              </div>
            )}

            {idoso.time_in_cabo_frio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tempo em Cabo Frio</label>
                <p className="text-gray-900">{idoso.time_in_cabo_frio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saúde */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Informações de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {idoso.blood_type && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo Sanguíneo</label>
                <Badge variant="secondary">{idoso.blood_type}</Badge>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Possui doença</span>
                <Badge variant={idoso.has_illness ? "destructive" : "secondary"}>
                  {idoso.has_illness ? "Sim" : "Não"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Possui alergia</span>
                <Badge variant={idoso.has_allergy ? "destructive" : "secondary"}>
                  {idoso.has_allergy ? "Sim" : "Não"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Tem filhos</span>
                <Badge variant="secondary">
                  {idoso.has_children ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>

            {idoso.medication_type && (
              <div>
                <label className="text-sm font-medium text-gray-500">Medicamentos</label>
                <p className="text-gray-900 text-sm">{idoso.medication_type}</p>
              </div>
            )}

            {idoso.health_plan && (
              <div>
                <label className="text-sm font-medium text-gray-500">Plano de Saúde</label>
                <p className="text-gray-900">{idoso.health_plan}</p>
              </div>
            )}

            {idoso.family_constitution && (
              <div>
                <label className="text-sm font-medium text-gray-500">Constituição Familiar</label>
                <p className="text-gray-900 text-sm">{idoso.family_constitution}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {idoso.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-gray-900 font-mono">{idoso.phone}</p>
              </div>
            )}

            {idoso.mobile_phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Celular</label>
                <p className="text-gray-900 font-mono">{idoso.mobile_phone}</p>
              </div>
            )}

            {idoso.guardian_name && (
              <div>
                <label className="text-sm font-medium text-gray-500">Responsável</label>
                <p className="text-gray-900">{idoso.guardian_name}</p>
              </div>
            )}

            {idoso.emergency_phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone de Emergência</label>
                <p className="text-gray-900 font-mono">{idoso.emergency_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        {idoso.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 text-sm whitespace-pre-wrap">{idoso.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
