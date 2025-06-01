
import { supabase } from '@/integrations/supabase/client';

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  cpf?: string;
  phone?: string;
  position?: string;
  role: 'admin' | 'operator';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface CreateStaffData {
  full_name: string;
  email: string;
  cpf?: string;
  phone?: string;
  position?: string;
  role: 'admin' | 'operator';
  status: 'active' | 'inactive';
  password: string;
}

export const staffManagementHelpers = {
  getAllStaff: async (): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match StaffMember interface
      const staffData: StaffMember[] = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        created_at: staff.created_at,
        status: 'active' as const, // Default status since column doesn't exist yet
        cpf: undefined,
        phone: undefined,
        position: undefined,
        updated_at: undefined
      })) || [];

      return { data: staffData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  createStaff: async (staffData: CreateStaffData): Promise<{ data: any, error: any }> => {
    try {
      // Primeiro criar o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: staffData.email,
        password: staffData.password,
        email_confirm: true,
        user_metadata: {
          full_name: staffData.full_name,
          role: staffData.role
        }
      });

      if (authError) {
        throw authError;
      }

      // Depois inserir na tabela staff (apenas campos existentes)
      const { data, error } = await supabase
        .from('staff')
        .insert({
          id: authData.user.id,
          full_name: staffData.full_name,
          email: staffData.email,
          role: staffData.role
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateStaff: async (id: string, updates: Partial<StaffMember>): Promise<{ data: any, error: any }> => {
    try {
      // Apenas atualizar campos que existem na tabela
      const updateData: any = {};
      if (updates.full_name) updateData.full_name = updates.full_name;
      if (updates.email) updateData.email = updates.email;
      if (updates.role) updateData.role = updates.role;

      const { data, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  deleteStaff: async (id: string): Promise<{ error: any }> => {
    try {
      // Primeiro deletar da tabela staff
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (staffError) {
        throw staffError;
      }

      // Depois deletar do auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      return { error: authError };
    } catch (error) {
      return { error };
    }
  },

  searchStaff: async (query: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, full_name, email, role, created_at')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const staffData: StaffMember[] = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        created_at: staff.created_at,
        status: 'active' as const,
        cpf: undefined,
        phone: undefined,
        position: undefined,
        updated_at: undefined
      })) || [];

      return { data: staffData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  filterStaffByStatus: async (status: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      let query = supabase
        .from('staff')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      // Como a coluna status não existe, vamos retornar todos os dados
      // e simular o filtro no frontend

      const { data, error } = await query;
      
      if (error) throw error;

      const staffData: StaffMember[] = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        created_at: staff.created_at,
        status: 'active' as const,
        cpf: undefined,
        phone: undefined,
        position: undefined,
        updated_at: undefined
      })) || [];

      return { data: staffData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
