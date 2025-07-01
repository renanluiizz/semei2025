
import { supabaseClient } from '@/lib/supabase-client';

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
      const { data, error } = await supabaseClient
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as StaffMember[], error: null };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return { data: null, error };
    }
  },

  createStaff: async (staffData: CreateStaffData): Promise<{ data: any, error: any }> => {
    try {
      // Primeiro criar o usuário no auth
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
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

      // Depois inserir na tabela staff com todos os campos
      const { data, error } = await supabaseClient
        .from('staff')
        .insert({
          id: authData.user.id,
          full_name: staffData.full_name,
          email: staffData.email,
          cpf: staffData.cpf,
          phone: staffData.phone,
          position: staffData.position,
          role: staffData.role,
          status: staffData.status || 'active'
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating staff:', error);
      return { data: null, error };
    }
  },

  updateStaff: async (id: string, updates: Partial<StaffMember>): Promise<{ data: any, error: any }> => {
    try {
      const { data, error } = await supabaseClient
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating staff:', error);
      return { data: null, error };
    }
  },

  deleteStaff: async (id: string): Promise<{ error: any }> => {
    try {
      // Primeiro deletar da tabela staff
      const { error: staffError } = await supabaseClient
        .from('staff')
        .delete()
        .eq('id', id);

      if (staffError) {
        throw staffError;
      }

      // Depois deletar do auth
      const { error: authError } = await supabaseClient.auth.admin.deleteUser(id);

      return { error: authError };
    } catch (error) {
      console.error('Error deleting staff:', error);
      return { error };
    }
  },

  searchStaff: async (query: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabaseClient
        .from('staff')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as StaffMember[], error: null };
    } catch (error) {
      console.error('Error searching staff:', error);
      return { data: null, error };
    }
  },

  filterStaffByStatus: async (status: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      let query = supabaseClient
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return { data: data as StaffMember[], error: null };
    } catch (error) {
      console.error('Error filtering staff:', error);
      return { data: null, error };
    }
  }
};
