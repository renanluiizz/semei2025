
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Staff, Elder, CheckIn, ActivityType, AuditLog } from '@/types/supabase-manual';

const SUPABASE_URL = "https://jdhwerigsegxfkkjcatw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaHdlcmlnc2VneGZra2pjYXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzA1MzIsImV4cCI6MjA2Njk0NjUzMn0.X9v1jH9Eo6G47wDVsG2yr5jo1tWJjhZsL0EkkD1v0P0";

// Database interface com nossos tipos
interface Database {
  public: {
    Tables: {
      staff: {
        Row: Staff;
        Insert: Omit<Staff, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>;
      };
      elders: {
        Row: Elder;
        Insert: Omit<Elder, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Elder, 'id' | 'created_at' | 'updated_at'>>;
      };
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CheckIn, 'id' | 'created_at' | 'updated_at'>>;
      };
      activity_types: {
        Row: ActivityType;
        Insert: Omit<ActivityType, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ActivityType, 'id' | 'created_at' | 'updated_at'>>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
