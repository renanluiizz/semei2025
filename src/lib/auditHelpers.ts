
import { supabaseClient } from '@/lib/supabase-client';
import type { AuditLog } from '@/types/supabase-manual';

export interface AuditLogEntry {
  id: string;
  table_name: string;
  operation: string;
  old_data?: any;
  new_data?: any;
  user_id?: string;
  timestamp: string;
  ip_address?: string;
}

export const auditHelpers = {
  // Get audit logs (admin only)
  getAuditLogs: async (filters?: {
    table_name?: string;
    operation?: string;
    user_id?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }) => {
    let query = supabaseClient
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.table_name) {
      query = query.eq('table_name', filters.table_name);
    }

    if (filters?.operation) {
      query = query.eq('operation', filters.operation);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.from_date) {
      query = query.gte('created_at', filters.from_date);
    }

    if (filters?.to_date) {
      query = query.lte('created_at', filters.to_date);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    
    if (data && !error) {
      // Transformar dados para formato esperado
      const transformedData: AuditLogEntry[] = data.map(log => ({
        id: log.id,
        table_name: log.table_name,
        operation: log.operation,
        old_data: log.old_data,
        new_data: log.new_data,
        user_id: log.user_id,
        timestamp: log.created_at,
        ip_address: log.ip_address
      }));
      
      return { data: transformedData, error: null };
    }
    
    return { data: [], error };
  },

  // Get audit summary for dashboard
  getAuditSummary: async () => {
    const { data, error } = await supabaseClient
      .from('audit_log')
      .select('table_name, operation, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };

    // Group by operation and table
    const summary = data?.reduce((acc: any, log) => {
      const key = `${log.table_name}_${log.operation}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return { data: summary, error: null };
  },

  // Format audit log entry for display
  formatAuditEntry: (entry: AuditLogEntry): string => {
    const operation = entry.operation.toLowerCase();
    const tableName = entry.table_name;
    const timestamp = new Date(entry.timestamp).toLocaleString('pt-BR');

    switch (operation) {
      case 'insert':
        return `Criou novo registro em ${tableName} em ${timestamp}`;
      case 'update':
        return `Atualizou registro em ${tableName} em ${timestamp}`;
      case 'delete':
        return `Removeu registro de ${tableName} em ${timestamp}`;
      default:
        return `Operação ${operation} em ${tableName} em ${timestamp}`;
    }
  }
};
