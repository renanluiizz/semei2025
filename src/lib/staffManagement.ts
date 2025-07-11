
import { supabase } from '@/integrations/supabase/client';

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'operator';
  cpf?: string;
  phone?: string;
  position?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateStaffData {
  full_name: string;
  email: string;
  role: 'admin' | 'operator';
  cpf?: string;
  phone?: string;
  position?: string;
  status: 'active' | 'inactive';
  password: string;
}

export const staffManagementHelpers = {
  getAllStaff: async (): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to ensure proper type handling
      const mappedData = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        cpf: staff.cpf || '',
        phone: staff.phone || '',
        position: staff.position || '',
        status: (staff.status || 'active') as 'active' | 'inactive',
        created_at: staff.created_at,
        updated_at: staff.updated_at
      })) as StaffMember[];

      return { data: mappedData, error: null };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return { data: null, error };
    }
  },

  createStaff: async (staffData: CreateStaffData): Promise<{ data: any, error: any }> => {
    try {
      // Criar usuário no auth com dados do staff
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: staffData.email,
        password: staffData.password,
        options: {
          data: {
            full_name: staffData.full_name,
            role: staffData.role,
            cpf: staffData.cpf,
            phone: staffData.phone,
            position: staffData.position,
            status: staffData.status
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Inserir manualmente na tabela staff se o trigger não funcionar
      if (authData.user) {
        const { data, error } = await supabase
          .from('staff')
          .insert({
            id: authData.user.id,
            email: staffData.email,
            full_name: staffData.full_name,
            role: staffData.role,
            cpf: staffData.cpf,
            phone: staffData.phone,
            position: staffData.position,
            status: staffData.status
          })
          .select()
          .single();

        return { data, error };
      }

      return { data: null, error: new Error('Failed to create user') };
    } catch (error) {
      console.error('Error creating staff:', error);
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
      console.error('Error updating staff:', error);
      return { data: null, error };
    }
  },

  deleteStaff: async (id: string): Promise<{ error: any }> => {
    try {
      // Deletar da tabela staff (o trigger de auth será acionado automaticamente)
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting staff:', error);
      return { error };
    }
  },

  searchStaff: async (query: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to ensure proper type handling
      const mappedData = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        cpf: staff.cpf || '',
        phone: staff.phone || '',
        position: staff.position || '',
        status: (staff.status || 'active') as 'active' | 'inactive',
        created_at: staff.created_at,
        updated_at: staff.updated_at
      })) as StaffMember[];

      return { data: mappedData, error: null };
    } catch (error) {
      console.error('Error searching staff:', error);
      return { data: null, error };
    }
  },

  filterStaffByStatus: async (status: string): Promise<{ data: StaffMember[] | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Map the data to ensure proper type handling
      const mappedData = data?.map(staff => ({
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'admin' | 'operator',
        cpf: staff.cpf || '',
        phone: staff.phone || '',
        position: staff.position || '',
        status: (staff.status || 'active') as 'active' | 'inactive',
        created_at: staff.created_at,
        updated_at: staff.updated_at
      })) as StaffMember[];

      return { data: mappedData, error: null };
    } catch (error) {
      console.error('Error filtering staff:', error);
      return { data: null, error };
    }
  }
};
