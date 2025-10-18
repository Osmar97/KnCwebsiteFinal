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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          images: string[] | null
          pdf_urls: string[] | null
          title: string
          updated_at: string
          video_urls: string[] | null
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          pdf_urls?: string[] | null
          title?: string
          updated_at?: string
          video_urls?: string[] | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          pdf_urls?: string[] | null
          title?: string
          updated_at?: string
          video_urls?: string[] | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          adapted_house: boolean | null
          air_conditioning: boolean | null
          balcony_terrace: boolean | null
          bathrooms: number | null
          bedrooms: string | null
          built_in_wardrobes: boolean | null
          city: string
          condition: string | null
          construction_area: number | null
          created_at: string
          description: string
          divisions: Json | null
          elevator: boolean | null
          featured: boolean | null
          floor: number | null
          floor_plan_url: string | null
          garden: boolean | null
          id: string
          images: string[] | null
          location: string
          luxury_house: boolean | null
          parking: boolean | null
          pool: boolean | null
          price: number
          private_area: number | null
          property_type: string
          sea_view: boolean | null
          status: string | null
          storage: boolean | null
          title: string
          total_floors: number | null
          transaction_type: string
          updated_at: string
          video_url: string | null
          virtual_tour_url: string | null
        }
        Insert: {
          adapted_house?: boolean | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          built_in_wardrobes?: boolean | null
          city: string
          condition?: string | null
          construction_area?: number | null
          created_at?: string
          description: string
          divisions?: Json | null
          elevator?: boolean | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          garden?: boolean | null
          id?: string
          images?: string[] | null
          location: string
          luxury_house?: boolean | null
          parking?: boolean | null
          pool?: boolean | null
          price: number
          private_area?: number | null
          property_type: string
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          title: string
          total_floors?: number | null
          transaction_type?: string
          updated_at?: string
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Update: {
          adapted_house?: boolean | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          built_in_wardrobes?: boolean | null
          city?: string
          condition?: string | null
          construction_area?: number | null
          created_at?: string
          description?: string
          divisions?: Json | null
          elevator?: boolean | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          garden?: boolean | null
          id?: string
          images?: string[] | null
          location?: string
          luxury_house?: boolean | null
          parking?: boolean | null
          pool?: boolean | null
          price?: number
          private_area?: number | null
          property_type?: string
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          title?: string
          total_floors?: number | null
          transaction_type?: string
          updated_at?: string
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
