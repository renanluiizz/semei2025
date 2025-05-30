
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User, Calendar, X } from 'lucide-react';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const { data: searchResults, refetch } = useQuery({
    queryKey: ['global-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return { idosos: [], atividades: [] };
      
      const [idososResult, atividadesResult] = await Promise.all([
        dbHelpers.getIdosos(),
        dbHelpers.getAtividades()
      ]);

      const idosos = idososResult.data?.filter(idoso => 
        idoso.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idoso.cpf.includes(searchTerm) ||
        idoso.phone?.includes(searchTerm)
      ) || [];

      const atividades = atividadesResult.data?.filter(atividade =>
        atividade.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        atividade.elder?.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

      return { idosos, atividades };
    },
    enabled: false
  });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        refetch().finally(() => setIsSearching(false));
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, refetch]);

  const handleResultClick = (type: 'idoso' | 'atividade', id: string) => {
    if (type === 'idoso') {
      navigate(`/idosos/${id}`);
    } else {
      navigate('/atividades');
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 p-4">
      <Card className="w-full max-w-2xl semei-card">
        <CardContent className="p-0">
          {/* Cabeçalho da busca */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar idosos, atividades, CPF, telefone..."
              className="border-0 focus:ring-0 focus:outline-none text-lg"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Resultados */}
          <div className="max-h-96 overflow-y-auto">
            {searchTerm.length < 2 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Digite pelo menos 2 caracteres para buscar</p>
              </div>
            ) : isSearching ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Buscando...</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Resultados de Idosos */}
                {searchResults?.idosos && searchResults.idosos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Idosos ({searchResults.idosos.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.idosos.slice(0, 5).map((idoso) => (
                        <div
                          key={idoso.id}
                          onClick={() => handleResultClick('idoso', idoso.id)}
                          className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{idoso.name}</p>
                              <p className="text-sm text-gray-500">
                                CPF: {idoso.cpf} • Idade: {idoso.age || 0} anos
                              </p>
                              {idoso.phone && (
                                <p className="text-sm text-gray-500">Tel: {idoso.phone}</p>
                              )}
                            </div>
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resultados de Atividades */}
                {searchResults?.atividades && searchResults.atividades.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Atividades ({searchResults.atividades.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.atividades.slice(0, 5).map((atividade) => (
                        <div
                          key={atividade.id}
                          onClick={() => handleResultClick('atividade', atividade.id)}
                          className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{atividade.activity_type}</p>
                              <p className="text-sm text-gray-500">
                                {atividade.elder?.name} • {new Date(atividade.check_in_time).toLocaleDateString('pt-BR')}
                              </p>
                              {atividade.observation && (
                                <p className="text-sm text-gray-500 truncate">{atividade.observation}</p>
                              )}
                            </div>
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nenhum resultado */}
                {searchResults && searchResults.idosos.length === 0 && searchResults.atividades.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                    <p className="text-sm mt-2">Tente buscar por nome, CPF ou telefone</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dicas de busca */}
          <div className="border-t p-3 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Dica: Use CPF, nome completo ou telefone para melhores resultados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
