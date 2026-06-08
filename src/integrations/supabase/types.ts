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
          agent_captador: string | null
          agent_comercializador: string | null
          air_conditioning: boolean | null
          balcony_terrace: boolean | null
          bathrooms: number | null
          bedrooms: string | null
          block: string | null
          building_year: number | null
          built_in_wardrobes: boolean | null
          city: string
          condition: string | null
          construction_area: number | null
          created_at: string
          description: string
          descriptions: Json | null
          divisions: Json | null
          door: string | null
          duplex: boolean | null
          elevator: boolean | null
          energy_class: string | null
          featured: boolean | null
          floor: number | null
          floor_plan_url: string | null
          floor_plans: string[] | null
          garden: boolean | null
          heating_type: string | null
          id: string
          images: string[] | null
          internal_reference: string | null
          is_top_floor: boolean | null
          location: string
          lot_area: number | null
          luxury_house: boolean | null
          no_street_number: boolean | null
          notes_visibility: string | null
          operation_rent: boolean | null
          operation_sale: boolean | null
          orientation_east: boolean | null
          orientation_north: boolean | null
          orientation_south: boolean | null
          orientation_west: boolean | null
          parking: boolean | null
          penthouse: boolean | null
          pool: boolean | null
          price: number
          private_area: number | null
          private_notes: string | null
          property_type: string
          sea_view: boolean | null
          status: string | null
          storage: boolean | null
          street_number: string | null
          t0: boolean | null
          title: string
          total_floors: number | null
          transaction_type: string
          updated_at: string
          urbanization_name: string | null
          video_url: string | null
          virtual_tour_url: string | null
        }
        Insert: {
          adapted_house?: boolean | null
          agent_captador?: string | null
          agent_comercializador?: string | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          block?: string | null
          building_year?: number | null
          built_in_wardrobes?: boolean | null
          city: string
          condition?: string | null
          construction_area?: number | null
          created_at?: string
          description: string
          descriptions?: Json | null
          divisions?: Json | null
          door?: string | null
          duplex?: boolean | null
          elevator?: boolean | null
          energy_class?: string | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          floor_plans?: string[] | null
          garden?: boolean | null
          heating_type?: string | null
          id?: string
          images?: string[] | null
          internal_reference?: string | null
          is_top_floor?: boolean | null
          location: string
          lot_area?: number | null
          luxury_house?: boolean | null
          no_street_number?: boolean | null
          notes_visibility?: string | null
          operation_rent?: boolean | null
          operation_sale?: boolean | null
          orientation_east?: boolean | null
          orientation_north?: boolean | null
          orientation_south?: boolean | null
          orientation_west?: boolean | null
          parking?: boolean | null
          penthouse?: boolean | null
          pool?: boolean | null
          price: number
          private_area?: number | null
          private_notes?: string | null
          property_type: string
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          street_number?: string | null
          t0?: boolean | null
          title: string
          total_floors?: number | null
          transaction_type?: string
          updated_at?: string
          urbanization_name?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Update: {
          adapted_house?: boolean | null
          agent_captador?: string | null
          agent_comercializador?: string | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          block?: string | null
          building_year?: number | null
          built_in_wardrobes?: boolean | null
          city?: string
          condition?: string | null
          construction_area?: number | null
          created_at?: string
          description?: string
          descriptions?: Json | null
          divisions?: Json | null
          door?: string | null
          duplex?: boolean | null
          elevator?: boolean | null
          energy_class?: string | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          floor_plans?: string[] | null
          garden?: boolean | null
          heating_type?: string | null
          id?: string
          images?: string[] | null
          internal_reference?: string | null
          is_top_floor?: boolean | null
          location?: string
          lot_area?: number | null
          luxury_house?: boolean | null
          no_street_number?: boolean | null
          notes_visibility?: string | null
          operation_rent?: boolean | null
          operation_sale?: boolean | null
          orientation_east?: boolean | null
          orientation_north?: boolean | null
          orientation_south?: boolean | null
          orientation_west?: boolean | null
          parking?: boolean | null
          penthouse?: boolean | null
          pool?: boolean | null
          price?: number
          private_area?: number | null
          private_notes?: string | null
          property_type?: string
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          street_number?: string | null
          t0?: boolean | null
          title?: string
          total_floors?: number | null
          transaction_type?: string
          updated_at?: string
          urbanization_name?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
      storage_audit_log: {
        Row: {
          action: string
          bucket: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          object_path: string | null
          success: boolean
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          was_admin: boolean
        }
        Insert: {
          action: string
          bucket: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          object_path?: string | null
          success: boolean
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          was_admin: boolean
        }
        Update: {
          action?: string
          bucket?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          object_path?: string | null
          success?: boolean
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          was_admin?: boolean
        }
        Relationships: []
      }
      tour_bookings: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          id: string
          source: string
          status: string
          stripe_session_id: string | null
          tour_date_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          source?: string
          status?: string
          stripe_session_id?: string | null
          tour_date_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          source?: string
          status?: string
          stripe_session_id?: string | null
          tour_date_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_bookings_tour_date_id_fkey"
            columns: ["tour_date_id"]
            isOneToOne: false
            referencedRelation: "tour_date_availability"
            referencedColumns: ["tour_date_id"]
          },
          {
            foreignKeyName: "tour_bookings_tour_date_id_fkey"
            columns: ["tour_date_id"]
            isOneToOne: false
            referencedRelation: "tour_dates"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_custom_quote_requests: {
        Row: {
          country: string | null
          created_at: string
          destinations: string[]
          email: string
          first_name: string
          hotel_preference: string | null
          id: string
          last_name: string
          nationality: string | null
          notes: string | null
          num_days: number | null
          num_guests: number | null
          payload: Json
          phone: string | null
          preferred_dates: string | null
          services: string[]
          status: string
          updated_at: string
          vibes: string[]
        }
        Insert: {
          country?: string | null
          created_at?: string
          destinations?: string[]
          email: string
          first_name: string
          hotel_preference?: string | null
          id?: string
          last_name: string
          nationality?: string | null
          notes?: string | null
          num_days?: number | null
          num_guests?: number | null
          payload?: Json
          phone?: string | null
          preferred_dates?: string | null
          services?: string[]
          status?: string
          updated_at?: string
          vibes?: string[]
        }
        Update: {
          country?: string | null
          created_at?: string
          destinations?: string[]
          email?: string
          first_name?: string
          hotel_preference?: string | null
          id?: string
          last_name?: string
          nationality?: string | null
          notes?: string | null
          num_days?: number | null
          num_guests?: number | null
          payload?: Json
          phone?: string | null
          preferred_dates?: string | null
          services?: string[]
          status?: string
          updated_at?: string
          vibes?: string[]
        }
        Relationships: []
      }
      tour_dates: {
        Row: {
          capacity: number
          created_at: string
          end_date: string
          id: string
          label: string | null
          sold_out: boolean
          start_date: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          end_date: string
          id?: string
          label?: string | null
          sold_out?: boolean
          start_date: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          end_date?: string
          id?: string
          label?: string | null
          sold_out?: boolean
          start_date?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_dates_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_waitlist_requests: {
        Row: {
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          payload: Json
          phone: string | null
          preferred_destinations: string[]
          status: string
          tour_id: string | null
          updated_at: string
          vibes: string[]
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          payload?: Json
          phone?: string | null
          preferred_destinations?: string[]
          status?: string
          tour_id?: string | null
          updated_at?: string
          vibes?: string[]
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          payload?: Json
          phone?: string | null
          preferred_destinations?: string[]
          status?: string
          tour_id?: string | null
          updated_at?: string
          vibes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "tour_waitlist_requests_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          badge: string | null
          badge_variant: string | null
          base_price: number
          category: string
          created_at: string
          currency: string
          description_en: string
          description_fr: string
          description_pt: string
          destinations: string[]
          duration_days: number
          early_bird_price: number | null
          flag: string | null
          gallery: string[]
          hero_image: string | null
          id: string
          name_en: string
          name_fr: string
          name_pt: string
          premium_price: number | null
          short_desc_en: string
          short_desc_fr: string
          short_desc_pt: string
          slug: string
          sort_order: number
          status: string
          tags: string[]
          tour_type: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          badge_variant?: string | null
          base_price?: number
          category?: string
          created_at?: string
          currency?: string
          description_en?: string
          description_fr?: string
          description_pt?: string
          destinations?: string[]
          duration_days?: number
          early_bird_price?: number | null
          flag?: string | null
          gallery?: string[]
          hero_image?: string | null
          id?: string
          name_en?: string
          name_fr?: string
          name_pt?: string
          premium_price?: number | null
          short_desc_en?: string
          short_desc_fr?: string
          short_desc_pt?: string
          slug: string
          sort_order?: number
          status?: string
          tags?: string[]
          tour_type?: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          badge_variant?: string | null
          base_price?: number
          category?: string
          created_at?: string
          currency?: string
          description_en?: string
          description_fr?: string
          description_pt?: string
          destinations?: string[]
          duration_days?: number
          early_bird_price?: number | null
          flag?: string | null
          gallery?: string[]
          hero_image?: string | null
          id?: string
          name_en?: string
          name_fr?: string
          name_pt?: string
          premium_price?: number | null
          short_desc_en?: string
          short_desc_fr?: string
          short_desc_pt?: string
          slug?: string
          sort_order?: number
          status?: string
          tags?: string[]
          tour_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      tour_date_availability: {
        Row: {
          capacity: number | null
          confirmed_count: number | null
          remaining: number | null
          tour_date_id: string | null
          tour_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_dates_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_tour_availability: {
        Args: never
        Returns: {
          capacity: number
          confirmed_count: number
          remaining: number
          tour_date_id: string
          tour_id: string
        }[]
      }
      is_admin_user: { Args: never; Returns: boolean }
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
