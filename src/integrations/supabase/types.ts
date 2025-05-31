export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          active: boolean | null
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          schedule: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          activity_type: string
          check_in_time: string
          created_at: string
          elder_id: string
          id: string
          observation: string | null
          staff_id: string
        }
        Insert: {
          activity_type: string
          check_in_time?: string
          created_at?: string
          elder_id: string
          id?: string
          observation?: string | null
          staff_id: string
        }
        Update: {
          activity_type?: string
          check_in_time?: string
          created_at?: string
          elder_id?: string
          id?: string
          observation?: string | null
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_elder_id_fkey"
            columns: ["elder_id"]
            isOneToOne: false
            referencedRelation: "elders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          admin_email: string | null
          default_hours: string | null
          id: string
          theme_mode: string | null
          use_webcam: boolean | null
        }
        Insert: {
          admin_email?: string | null
          default_hours?: string | null
          id?: string
          theme_mode?: string | null
          use_webcam?: boolean | null
        }
        Update: {
          admin_email?: string | null
          default_hours?: string | null
          id?: string
          theme_mode?: string | null
          use_webcam?: boolean | null
        }
        Relationships: []
      }
      elder_activities: {
        Row: {
          active: boolean | null
          activity_id: string
          elder_id: string
          enrolled_at: string
          id: string
        }
        Insert: {
          active?: boolean | null
          activity_id: string
          elder_id: string
          enrolled_at?: string
          id?: string
        }
        Update: {
          active?: boolean | null
          activity_id?: string
          elder_id?: string
          enrolled_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elder_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elder_activities_elder_id_fkey"
            columns: ["elder_id"]
            isOneToOne: false
            referencedRelation: "elders"
            referencedColumns: ["id"]
          },
        ]
      }
      elders: {
        Row: {
          address: string | null
          age: number | null
          birth_date: string
          birthplace: string | null
          blood_type: string | null
          cpf: string
          created_at: string
          emergency_phone: string | null
          family_constitution: string | null
          father_name: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_name: string | null
          has_allergy: boolean | null
          has_children: boolean | null
          has_illness: boolean | null
          health_plan: string | null
          id: string
          marital_status: string | null
          medication_type: string | null
          mobile_phone: string | null
          mother_name: string | null
          name: string
          neighborhood: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          registration_date: string | null
          responsible_staff_id: string | null
          rg: string | null
          state: string | null
          time_in_cabo_frio: string | null
          zone: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          birth_date: string
          birthplace?: string | null
          blood_type?: string | null
          cpf: string
          created_at?: string
          emergency_phone?: string | null
          family_constitution?: string | null
          father_name?: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_name?: string | null
          has_allergy?: boolean | null
          has_children?: boolean | null
          has_illness?: boolean | null
          health_plan?: string | null
          id?: string
          marital_status?: string | null
          medication_type?: string | null
          mobile_phone?: string | null
          mother_name?: string | null
          name: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          registration_date?: string | null
          responsible_staff_id?: string | null
          rg?: string | null
          state?: string | null
          time_in_cabo_frio?: string | null
          zone?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          birth_date?: string
          birthplace?: string | null
          blood_type?: string | null
          cpf?: string
          created_at?: string
          emergency_phone?: string | null
          family_constitution?: string | null
          father_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          guardian_name?: string | null
          has_allergy?: boolean | null
          has_children?: boolean | null
          has_illness?: boolean | null
          health_plan?: string | null
          id?: string
          marital_status?: string | null
          medication_type?: string | null
          mobile_phone?: string | null
          mother_name?: string | null
          name?: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          registration_date?: string | null
          responsible_staff_id?: string | null
          rg?: string | null
          state?: string | null
          time_in_cabo_frio?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elders_responsible_staff_id_fkey"
            columns: ["responsible_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_age: {
        Args: { birth_date: string }
        Returns: number
      }
      get_staff_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_cpf: {
        Args: { cpf_input: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email_input: string }
        Returns: boolean
      }
      validate_phone: {
        Args: { phone_input: string }
        Returns: boolean
      }
    }
    Enums: {
      gender_type: "masculino" | "feminino" | "outro"
      staff_role: "admin" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["masculino", "feminino", "outro"],
      staff_role: ["admin", "operator"],
    },
  },
} as const
