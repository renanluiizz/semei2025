
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
        .select('id, full_name, email, cpf, phone, position, role, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure all required fields are present with defaults
      const staffData = data?.map(staff => ({
        ...staff,
        status: staff.status || 'active',
        cpf: staff.cpf || undefined,
        phone: staff.phone || undefined,
        position: staff.position || undefined,
        updated_at: staff.updated_at || undefined
      })) as StaffMember[];

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

      // Depois inserir na tabela staff
      const { data, error } = await supabase
        .from('staff')
        .insert({
          id: authData.user.id,
          full_name: staffData.full_name,
          email: staffData.email,
          cpf: staffData.cpf,
          phone: staffData.phone,
          position: staffData.position,
          role: staffData.role,
          status: staffData.status
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
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
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
        .select('id, full_name, email, cpf, phone, position, role, status, created_at, updated_at')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const staffData = data?.map(staff => ({
        ...staff,
        status: staff.status || 'active',
        cpf: staff.cpf || undefined,
        phone: staff.phone || undefined,
        position: staff.position || undefined,
        updated_at: staff.updated_at || undefined
      })) as StaffMember[];

      return { data: staffData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  filterStaffByStatus: async (status: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      let query = supabase
        .from('staff')
        .select('id, full_name, email, cpf, phone, position, role, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const staffData = data?.map(staff => ({
        ...staff,
        status: staff.status || 'active',
        cpf: staff.cpf || undefined,
        phone: staff.phone || undefined,
        position: staff.position || undefined,
        updated_at: staff.updated_at || undefined
      })) as StaffMember[];

      return { data: staffData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
