
import { supabase } from '@/integrations/supabase/client';

// Staff database operations
export const staffHelpers = {
  updateStaffProfile: async (id: string, updates: { full_name?: string; email?: string }) => {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },
};
