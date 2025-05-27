
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, User } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Idoso } from '@/types/models';

export function IdososList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: idosos, isLoading } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const filteredIdosos = idosos?.filter(idoso =>
    idoso.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idoso.cpf.includes(searchTerm)
  ) || [];

  const getAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Idosos</h1>
          <p className="text-gray-500 mt-1">
            Gerencie os idosos cadastrados no sistema
          </p>
        </div>
        <Link to="/idosos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Idoso
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredIdosos.length} idosos encontrados
        </p>
      </div>

      {/* Idosos List */}
      <div className="space-y-4">
        {filteredIdosos.length > 0 ? (
          filteredIdosos.map((idoso: Idoso) => (
            <Card key={idoso.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {idoso.name}
                        </h3>
                        <Badge variant="secondary">
                          {getAge(idoso.birth_date)} anos
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">CPF:</span> {idoso.cpf}
                        </div>
                        <div>
                          <span className="font-medium">Nascimento:</span>{' '}
                          {format(new Date(idoso.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span>{' '}
                          {idoso.phone || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">Bairro:</span> {idoso.neighborhood || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">Gênero:</span>{' '}
                          <Badge variant="outline" className="ml-1">
                            {idoso.gender}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Estado Civil:</span> {idoso.marital_status || 'Não informado'}
                        </div>
                      </div>

                      {idoso.guardian_name && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Responsável:</span> {idoso.guardian_name}
                          {idoso.emergency_phone && (
                            <span className="ml-2">• {idoso.emergency_phone}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/idosos/${idoso.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/idosos/${idoso.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum idoso encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Comece cadastrando o primeiro idoso.'}
              </p>
              {!searchTerm && (
                <Link to="/idosos/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Idoso
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
