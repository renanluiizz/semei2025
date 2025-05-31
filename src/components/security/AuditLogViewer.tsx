
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { auditHelpers, AuditLogEntry } from '@/lib/auditHelpers';
import { RoleGuard } from './RoleGuard';
import { Shield, Search, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    table_name: '',
    operation: '',
    limit: 50
  });

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await auditHelpers.getAuditLogs(filters);
      if (error) {
        toast.error('Erro ao carregar logs de auditoria');
        console.error('Audit logs error:', error);
      } else {
        setLogs(data || []);
      }
    } catch (error) {
      toast.error('Erro ao carregar logs de auditoria');
      console.error('Audit logs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadAuditLogs();
  };

  const getOperationColor = (operation: string) => {
    switch (operation.toLowerCase()) {
      case 'insert': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOperationLabel = (operation: string) => {
    switch (operation.toLowerCase()) {
      case 'insert': return 'Criação';
      case 'update': return 'Atualização';
      case 'delete': return 'Exclusão';
      default: return operation;
    }
  };

  return (
    <RoleGuard requiredRole="admin">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Logs de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select onValueChange={(value) => handleFilterChange('table_name', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="elders">Idosos</SelectItem>
                <SelectItem value="staff">Funcionários</SelectItem>
                <SelectItem value="check_ins">Check-ins</SelectItem>
                <SelectItem value="activities">Atividades</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('operation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="INSERT">Criação</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('limit', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Limite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 registros</SelectItem>
                <SelectItem value="50">50 registros</SelectItem>
                <SelectItem value="100">100 registros</SelectItem>
                <SelectItem value="200">200 registros</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={applyFilters} disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>

          {/* Logs List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Carregando logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum log encontrado
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getOperationColor(log.operation)}>
                        {getOperationLabel(log.operation)}
                      </Badge>
                      <span className="font-medium">{log.table_name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {auditHelpers.formatAuditEntry(log)}
                  </p>
                  {log.user_id && (
                    <p className="text-xs text-gray-500">
                      Usuário: {log.user_id}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {logs.length > 0 && (
            <div className="text-center">
              <Button variant="outline" onClick={loadAuditLogs}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Logs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleGuard>
  );
}
