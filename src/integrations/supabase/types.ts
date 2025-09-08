export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          id: string
          is_recurring: boolean | null
          label: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_recurring?: boolean | null
          label: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_recurring?: boolean | null
          label?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          annual_leave_total: number | null
          annual_leave_used: number | null
          created_at: string
          id: string
          rtt_total: number | null
          rtt_used: number | null
          sick_leave_used: number | null
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          annual_leave_total?: number | null
          annual_leave_used?: number | null
          created_at?: string
          id?: string
          rtt_total?: number | null
          rtt_used?: number | null
          sick_leave_used?: number | null
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          annual_leave_total?: number | null
          annual_leave_used?: number | null
          created_at?: string
          id?: string
          rtt_total?: number | null
          rtt_used?: number | null
          sick_leave_used?: number | null
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          half_day_end: boolean | null
          half_day_start: boolean | null
          id: string
          manager_comment: string | null
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"]
          total_days: number
          type_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          half_day_end?: boolean | null
          half_day_start?: boolean | null
          id?: string
          manager_comment?: string | null
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"]
          total_days: number
          type_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          half_day_end?: boolean | null
          half_day_start?: boolean | null
          id?: string
          manager_comment?: string | null
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"]
          total_days?: number
          type_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_paid: boolean | null
          label: string
          max_days_per_year: number | null
          requires_approval: boolean | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_paid?: boolean | null
          label: string
          max_days_per_year?: number | null
          requires_approval?: boolean | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_paid?: boolean | null
          label?: string
          max_days_per_year?: number | null
          requires_approval?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: number
          is_read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          annual_leave_days: number | null
          created_at: string
          department: string | null
          email: string
          id: string
          job_title: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          rtt_days: number | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_leave_days?: number | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          job_title?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          rtt_days?: number | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_leave_days?: number | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          job_title?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          rtt_days?: number | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_balances: {
        Args: { p_uid: string }
        Returns: {
          leave_type_label: string
          remaining_days: number
          total_days: number
          used_days: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_manager: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      request_status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
      user_role: "EMPLOYEE" | "MANAGER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      request_status: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      user_role: ["EMPLOYEE", "MANAGER", "ADMIN"],
    },
  },
} as const
