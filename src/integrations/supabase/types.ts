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
      bookings: {
        Row: {
          booking_status: string
          created_at: string
          experience_id: string
          id: string
          payment_status: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          booking_status?: string
          created_at?: string
          experience_id: string
          id?: string
          payment_status?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          booking_status?: string
          created_at?: string
          experience_id?: string
          id?: string
          payment_status?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          country_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          country_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      city_papers: {
        Row: {
          city_id: string | null
          content_markdown: string | null
          country_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean
          pdf_path: string | null
          pdf_url: string | null
          premium_only: boolean
          sections: Json | null
          subtitle: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          city_id?: string | null
          content_markdown?: string | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          pdf_path?: string | null
          pdf_url?: string | null
          premium_only?: boolean
          sections?: Json | null
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          city_id?: string | null
          content_markdown?: string | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          pdf_path?: string | null
          pdf_url?: string | null
          premium_only?: boolean
          sections?: Json | null
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_papers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_papers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      comments_kttc: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_kttc_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_kttc"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          booking_date: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          booking_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          booking_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed: boolean
          course_id: string
          created_at: string
          id: string
          progress_percentage: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          created_at?: string
          id?: string
          progress_percentage?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          created_at?: string
          id?: string
          progress_percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_favorites: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_favorites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_purchases: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          id: string
          payment_status: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          course_id: string
          created_at?: string
          id?: string
          payment_status?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          id?: string
          payment_status?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_resources: {
        Row: {
          course_id: string
          created_at: string
          file_url: string | null
          id: string
          title: string
          unlock_type: string
        }
        Insert: {
          course_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          title: string
          unlock_type?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          title?: string
          unlock_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          country_id: string | null
          created_at: string
          description: string | null
          id: string
          is_paid: boolean
          is_published: boolean
          price: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          price?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          price?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_calculators: {
        Row: {
          cash_flow: number | null
          city_id: string | null
          created_at: string
          id: string
          monthly_rent: number
          notes: string | null
          purchase_price: number
          renovation_cost: number
          roi: number | null
          updated_at: string
          user_id: string
          yield: number | null
        }
        Insert: {
          cash_flow?: number | null
          city_id?: string | null
          created_at?: string
          id?: string
          monthly_rent?: number
          notes?: string | null
          purchase_price?: number
          renovation_cost?: number
          roi?: number | null
          updated_at?: string
          user_id: string
          yield?: number | null
        }
        Update: {
          cash_flow?: number | null
          city_id?: string | null
          created_at?: string
          id?: string
          monthly_rent?: number
          notes?: string | null
          purchase_price?: number
          renovation_cost?: number
          roi?: number | null
          updated_at?: string
          user_id?: string
          yield?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_calculators_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          capacity: number
          city_id: string | null
          country_id: string
          created_at: string
          date_end: string | null
          date_start: string | null
          description: string | null
          id: string
          price: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          city_id?: string | null
          country_id: string
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          id?: string
          price?: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          city_id?: string | null
          country_id?: string
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          id?: string
          price?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_showcase_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          post_url: string | null
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          post_url?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          post_url?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          country_id: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          target_country: string | null
          target_goal: string | null
          target_stage: string | null
          title: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          target_country?: string | null
          target_goal?: string | null
          target_stage?: string | null
          title: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          target_country?: string | null
          target_goal?: string | null
          target_stage?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_attachments: {
        Row: {
          created_at: string
          file_size_bytes: number | null
          file_storage_path: string
          id: string
          lesson_id: string
          mime_type: string | null
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          file_size_bytes?: number | null
          file_storage_path: string
          id?: string
          lesson_id: string
          mime_type?: string | null
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string
          file_size_bytes?: number | null
          file_storage_path?: string
          id?: string
          lesson_id?: string
          mime_type?: string | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_attachments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_bookmarks: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_bookmarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          last_position_seconds: number
          lesson_id: string
          updated_at: string
          user_id: string
          watched_percentage: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          last_position_seconds?: number
          lesson_id: string
          updated_at?: string
          user_id: string
          watched_percentage?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          last_position_seconds?: number
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watched_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          auto_complete_on_watch: boolean
          content: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          module_id: string
          order_index: number
          prerequisite_lesson_id: string | null
          status: string
          thumbnail_storage_path: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_duration_seconds: number | null
          video_mime_type: string | null
          video_size_bytes: number | null
          video_storage_path: string | null
          video_uploaded_at: string | null
          video_url: string | null
        }
        Insert: {
          auto_complete_on_watch?: boolean
          content?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id: string
          order_index?: number
          prerequisite_lesson_id?: string | null
          status?: string
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_duration_seconds?: number | null
          video_mime_type?: string | null
          video_size_bytes?: number | null
          video_storage_path?: string | null
          video_uploaded_at?: string | null
          video_url?: string | null
        }
        Update: {
          auto_complete_on_watch?: boolean
          content?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id?: string
          order_index?: number
          prerequisite_lesson_id?: string | null
          status?: string
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_duration_seconds?: number | null
          video_mime_type?: string | null
          video_size_bytes?: number | null
          video_storage_path?: string | null
          video_uploaded_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_prerequisite_lesson_id_fkey"
            columns: ["prerequisite_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      likes_kttc: {
        Row: {
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_kttc_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_kttc"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhood_details: {
        Row: {
          ai_story: string | null
          avg_price: number | null
          beach_access: boolean | null
          bike_lanes: boolean | null
          bus_stations: Json | null
          city_avg_price: number | null
          cons: Json | null
          coworking_density: string | null
          coworking_spaces: Json | null
          created_at: string
          expat_popularity: string | null
          green_areas: string | null
          hospitals: Json | null
          id: string
          ideal_for: Json | null
          kttc_insight: string | null
          markets: Json | null
          metro_access: boolean | null
          metro_lines: Json | null
          neighborhood_id: string
          not_ideal_for: Json | null
          parks: Json | null
          price_growth: number | null
          price_level: string | null
          pros: Json | null
          story_intro: string | null
          tourist_density: string | null
          train_stations: Json | null
          transport_quality: string | null
          updated_at: string
        }
        Insert: {
          ai_story?: string | null
          avg_price?: number | null
          beach_access?: boolean | null
          bike_lanes?: boolean | null
          bus_stations?: Json | null
          city_avg_price?: number | null
          cons?: Json | null
          coworking_density?: string | null
          coworking_spaces?: Json | null
          created_at?: string
          expat_popularity?: string | null
          green_areas?: string | null
          hospitals?: Json | null
          id?: string
          ideal_for?: Json | null
          kttc_insight?: string | null
          markets?: Json | null
          metro_access?: boolean | null
          metro_lines?: Json | null
          neighborhood_id: string
          not_ideal_for?: Json | null
          parks?: Json | null
          price_growth?: number | null
          price_level?: string | null
          pros?: Json | null
          story_intro?: string | null
          tourist_density?: string | null
          train_stations?: Json | null
          transport_quality?: string | null
          updated_at?: string
        }
        Update: {
          ai_story?: string | null
          avg_price?: number | null
          beach_access?: boolean | null
          bike_lanes?: boolean | null
          bus_stations?: Json | null
          city_avg_price?: number | null
          cons?: Json | null
          coworking_density?: string | null
          coworking_spaces?: Json | null
          created_at?: string
          expat_popularity?: string | null
          green_areas?: string | null
          hospitals?: Json | null
          id?: string
          ideal_for?: Json | null
          kttc_insight?: string | null
          markets?: Json | null
          metro_access?: boolean | null
          metro_lines?: Json | null
          neighborhood_id?: string
          not_ideal_for?: Json | null
          parks?: Json | null
          price_growth?: number | null
          price_level?: string | null
          pros?: Json | null
          story_intro?: string | null
          tourist_density?: string | null
          train_stations?: Json | null
          transport_quality?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhood_details_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: true
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhood_stats: {
        Row: {
          city_id: string
          created_at: string
          id: string
          investment_rating: string | null
          lifestyle_score: number | null
          name: string
          notes: string | null
          price_per_m2: number | null
          rental_yield: number | null
          safety_score: number | null
          transport_score: number | null
          updated_at: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          investment_rating?: string | null
          lifestyle_score?: number | null
          name: string
          notes?: string | null
          price_per_m2?: number | null
          rental_yield?: number | null
          safety_score?: number | null
          transport_score?: number | null
          updated_at?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          investment_rating?: string | null
          lifestyle_score?: number | null
          name?: string
          notes?: string | null
          price_per_m2?: number | null
          rental_yield?: number | null
          safety_score?: number | null
          transport_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhood_stats_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          city: string
          country: string
          created_at: string
          distance_to_center: string | null
          id: string
          investment_score: number | null
          is_published: boolean
          lifestyle_score: number | null
          name: string
          price_per_m2: number | null
          region: string
          risk_level: string | null
          safety_score: number | null
          transport_score: number | null
          updated_at: string
          vibe: string | null
          yield: number | null
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          distance_to_center?: string | null
          id?: string
          investment_score?: number | null
          is_published?: boolean
          lifestyle_score?: number | null
          name: string
          price_per_m2?: number | null
          region: string
          risk_level?: string | null
          safety_score?: number | null
          transport_score?: number | null
          updated_at?: string
          vibe?: string | null
          yield?: number | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          distance_to_center?: string | null
          id?: string
          investment_score?: number | null
          is_published?: boolean
          lifestyle_score?: number | null
          name?: string
          price_per_m2?: number | null
          region?: string
          risk_level?: string | null
          safety_score?: number | null
          transport_score?: number | null
          updated_at?: string
          vibe?: string | null
          yield?: number | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          city_id: string | null
          contact_email: string | null
          country_id: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          category: string
          city_id?: string | null
          contact_email?: string | null
          country_id: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          category?: string
          city_id?: string | null
          contact_email?: string | null
          country_id?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      path_courses: {
        Row: {
          course_id: string
          id: string
          order_index: number
          path_id: string
        }
        Insert: {
          course_id: string
          id?: string
          order_index?: number
          path_id: string
        }
        Update: {
          course_id?: string
          id?: string
          order_index?: number
          path_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "path_courses_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
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
      posts_kttc: {
        Row: {
          category: string
          city_id: string | null
          content: string
          country_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          city_id?: string | null
          content: string
          country_id?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city_id?: string | null
          content?: string
          country_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_kttc_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_kttc_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      private_tour_settings: {
        Row: {
          created_at: string
          default_currency: string
          deposit_ratio: number
          id: boolean
          max_days: number
          min_days: number
          promo_discount_pct: number | null
          promo_label: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_currency?: string
          deposit_ratio?: number
          id?: boolean
          max_days?: number
          min_days?: number
          promo_discount_pct?: number | null
          promo_label?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_currency?: string
          deposit_ratio?: number
          id?: boolean
          max_days?: number
          min_days?: number
          promo_discount_pct?: number | null
          promo_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_origin: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          main_goal: string | null
          onboarding_completed: boolean
          relocation_stage: string | null
          status: string
          target_city_id: string | null
          target_country_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country_origin?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          main_goal?: string | null
          onboarding_completed?: boolean
          relocation_stage?: string | null
          status?: string
          target_city_id?: string | null
          target_country_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country_origin?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          main_goal?: string | null
          onboarding_completed?: boolean
          relocation_stage?: string | null
          status?: string
          target_city_id?: string | null
          target_country_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_target_city_id_fkey"
            columns: ["target_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_target_country_id_fkey"
            columns: ["target_country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
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
      quiz_answers: {
        Row: {
          answer_text: string
          id: string
          is_correct: boolean
          question_id: string
        }
        Insert: {
          answer_text: string
          id?: string
          is_correct?: boolean
          question_id: string
        }
        Update: {
          answer_text?: string
          id?: string
          is_correct?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          id: string
          order_index: number
          question: string
          quiz_id: string
          type: string
        }
        Insert: {
          id?: string
          order_index?: number
          question: string
          quiz_id: string
          type?: string
        }
        Update: {
          id?: string
          order_index?: number
          question?: string
          quiz_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          lesson_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          lesson_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          lesson_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      site_social_links: {
        Row: {
          created_at: string
          facebook_url: string
          id: string
          instagram_url: string
          instagram_username: string
          linkedin_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          facebook_url?: string
          id?: string
          instagram_url?: string
          instagram_username?: string
          linkedin_url?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          facebook_url?: string
          id?: string
          instagram_url?: string
          instagram_username?: string
          linkedin_url?: string
          updated_at?: string
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
      tour_addons: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          desc_en: string
          desc_fr: string
          desc_pt: string
          icon: string
          id: string
          is_complimentary: boolean
          label_en: string
          label_fr: string
          label_pt: string
          note_en: string
          note_fr: string
          note_pt: string
          price: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          desc_en?: string
          desc_fr?: string
          desc_pt?: string
          icon?: string
          id?: string
          is_complimentary?: boolean
          label_en: string
          label_fr?: string
          label_pt?: string
          note_en?: string
          note_fr?: string
          note_pt?: string
          price?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          desc_en?: string
          desc_fr?: string
          desc_pt?: string
          icon?: string
          id?: string
          is_complimentary?: boolean
          label_en?: string
          label_fr?: string
          label_pt?: string
          note_en?: string
          note_fr?: string
          note_pt?: string
          price?: number
          slug?: string
          sort_order?: number
          updated_at?: string
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
      tour_clarity_call_slots: {
        Row: {
          booked_by_request_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          is_available: boolean
          slot_at: string
          updated_at: string
        }
        Insert: {
          booked_by_request_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          is_available?: boolean
          slot_at: string
          updated_at?: string
        }
        Update: {
          booked_by_request_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          is_available?: boolean
          slot_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tour_custom_quote_requests: {
        Row: {
          budget: string | null
          clarity_call_slot_id: string | null
          country: string | null
          created_at: string
          currency: string
          deposit_amount: number | null
          destination_slug: string | null
          destinations: string[]
          email: string
          extras_slugs: string[]
          first_name: string
          hotel_preference: string | null
          id: string
          last_name: string
          nationality: string | null
          notes: string | null
          num_days: number | null
          num_guests: number | null
          payload: Json
          payment_status: string
          phone: string | null
          preferred_dates: string | null
          start_tour_date_id: string | null
          status: string
          stripe_session_id: string | null
          total_amount: number | null
          updated_at: string
          vibes: string[]
        }
        Insert: {
          budget?: string | null
          clarity_call_slot_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deposit_amount?: number | null
          destination_slug?: string | null
          destinations?: string[]
          email: string
          extras_slugs?: string[]
          first_name: string
          hotel_preference?: string | null
          id?: string
          last_name: string
          nationality?: string | null
          notes?: string | null
          num_days?: number | null
          num_guests?: number | null
          payload?: Json
          payment_status?: string
          phone?: string | null
          preferred_dates?: string | null
          start_tour_date_id?: string | null
          status?: string
          stripe_session_id?: string | null
          total_amount?: number | null
          updated_at?: string
          vibes?: string[]
        }
        Update: {
          budget?: string | null
          clarity_call_slot_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deposit_amount?: number | null
          destination_slug?: string | null
          destinations?: string[]
          email?: string
          extras_slugs?: string[]
          first_name?: string
          hotel_preference?: string | null
          id?: string
          last_name?: string
          nationality?: string | null
          notes?: string | null
          num_days?: number | null
          num_guests?: number | null
          payload?: Json
          payment_status?: string
          phone?: string | null
          preferred_dates?: string | null
          start_tour_date_id?: string | null
          status?: string
          stripe_session_id?: string | null
          total_amount?: number | null
          updated_at?: string
          vibes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "tour_custom_quote_requests_clarity_call_slot_id_fkey"
            columns: ["clarity_call_slot_id"]
            isOneToOne: false
            referencedRelation: "tour_clarity_call_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_custom_quote_requests_start_tour_date_id_fkey"
            columns: ["start_tour_date_id"]
            isOneToOne: false
            referencedRelation: "tour_date_availability"
            referencedColumns: ["tour_date_id"]
          },
          {
            foreignKeyName: "tour_custom_quote_requests_start_tour_date_id_fkey"
            columns: ["start_tour_date_id"]
            isOneToOne: false
            referencedRelation: "tour_dates"
            referencedColumns: ["id"]
          },
        ]
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
      tour_destinations: {
        Row: {
          active: boolean
          archived: boolean
          base_price_per_day_per_person: number
          card_image_url: string | null
          created_at: string
          currency: string
          desc_en: string
          desc_fr: string
          desc_pt: string
          flag: string
          hero_image_url: string | null
          id: string
          label_en: string
          label_fr: string
          label_pt: string
          max_days: number
          max_guests: number
          min_days: number
          min_guests: number
          region: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          archived?: boolean
          base_price_per_day_per_person?: number
          card_image_url?: string | null
          created_at?: string
          currency?: string
          desc_en?: string
          desc_fr?: string
          desc_pt?: string
          flag?: string
          hero_image_url?: string | null
          id?: string
          label_en: string
          label_fr?: string
          label_pt?: string
          max_days?: number
          max_guests?: number
          min_days?: number
          min_guests?: number
          region?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          archived?: boolean
          base_price_per_day_per_person?: number
          card_image_url?: string | null
          created_at?: string
          currency?: string
          desc_en?: string
          desc_fr?: string
          desc_pt?: string
          flag?: string
          hero_image_url?: string | null
          id?: string
          label_en?: string
          label_fr?: string
          label_pt?: string
          max_days?: number
          max_guests?: number
          min_days?: number
          min_guests?: number
          region?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tour_included_items: {
        Row: {
          active: boolean
          created_at: string
          id: string
          sort_order: number
          text_en: string
          text_fr: string
          text_pt: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          sort_order?: number
          text_en: string
          text_fr?: string
          text_pt?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          sort_order?: number
          text_en?: string
          text_fr?: string
          text_pt?: string
          updated_at?: string
        }
        Relationships: []
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
      tour_where_we_go: {
        Row: {
          country_name_en: string
          country_name_fr: string | null
          country_name_pt: string | null
          created_at: string
          description_en: string | null
          description_fr: string | null
          description_pt: string | null
          id: string
          image_url: string | null
          published: boolean
          sort_order: number
          subtitle_en: string | null
          subtitle_fr: string | null
          subtitle_pt: string | null
          updated_at: string
        }
        Insert: {
          country_name_en: string
          country_name_fr?: string | null
          country_name_pt?: string | null
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_pt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_pt?: string | null
          updated_at?: string
        }
        Update: {
          country_name_en?: string
          country_name_fr?: string | null
          country_name_pt?: string | null
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_pt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_pt?: string | null
          updated_at?: string
        }
        Relationships: []
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
      user_lesson_activity: {
        Row: {
          id: string
          last_viewed_at: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_viewed_at?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_viewed_at?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_activity_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_answers: {
        Row: {
          attempt_id: string
          id: string
          question_id: string
          selected_answer_id: string | null
        }
        Insert: {
          attempt_id: string
          id?: string
          question_id: string
          selected_answer_id?: string | null
        }
        Update: {
          attempt_id?: string
          id?: string
          question_id?: string
          selected_answer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "user_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quiz_answers_selected_answer_id_fkey"
            columns: ["selected_answer_id"]
            isOneToOne: false
            referencedRelation: "quiz_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quiz_answers_selected_answer_id_fkey"
            columns: ["selected_answer_id"]
            isOneToOne: false
            referencedRelation: "quiz_answers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_attempts: {
        Row: {
          attempt_number: number
          created_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          user_id: string
        }
        Insert: {
          attempt_number?: number
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          user_id: string
        }
        Update: {
          attempt_number?: number
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_shortlists: {
        Row: {
          created_at: string
          id: string
          neighborhood_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          neighborhood_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          neighborhood_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_shortlists_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      video_watch_history: {
        Row: {
          created_at: string
          id: string
          last_position_seconds: number
          lesson_id: string
          total_watch_seconds: number
          updated_at: string
          user_id: string
          watch_count: number
          watched_percentage: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_position_seconds?: number
          lesson_id: string
          total_watch_seconds?: number
          updated_at?: string
          user_id: string
          watch_count?: number
          watched_percentage?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_position_seconds?: number
          lesson_id?: string
          total_watch_seconds?: number
          updated_at?: string
          user_id?: string
          watch_count?: number
          watched_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "video_watch_history_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          country_id: string | null
          created_at: string
          description: string | null
          id: string
          thumbnail: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinars_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      partners_public: {
        Row: {
          category: string | null
          city_id: string | null
          country_id: string | null
          created_at: string | null
          description: string | null
          id: string | null
          logo_url: string | null
          name: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      properties_public: {
        Row: {
          adapted_house: boolean | null
          air_conditioning: boolean | null
          balcony_terrace: boolean | null
          bathrooms: number | null
          bedrooms: string | null
          building_year: number | null
          built_in_wardrobes: boolean | null
          city: string | null
          condition: string | null
          construction_area: number | null
          created_at: string | null
          description: string | null
          descriptions: Json | null
          divisions: Json | null
          duplex: boolean | null
          elevator: boolean | null
          energy_class: string | null
          featured: boolean | null
          floor: number | null
          floor_plan_url: string | null
          floor_plans: string[] | null
          garden: boolean | null
          heating_type: string | null
          id: string | null
          images: string[] | null
          is_top_floor: boolean | null
          location: string | null
          lot_area: number | null
          luxury_house: boolean | null
          operation_rent: boolean | null
          operation_sale: boolean | null
          orientation_east: boolean | null
          orientation_north: boolean | null
          orientation_south: boolean | null
          orientation_west: boolean | null
          parking: boolean | null
          penthouse: boolean | null
          pool: boolean | null
          price: number | null
          private_area: number | null
          property_type: string | null
          sea_view: boolean | null
          status: string | null
          storage: boolean | null
          t0: boolean | null
          title: string | null
          total_floors: number | null
          transaction_type: string | null
          updated_at: string | null
          video_url: string | null
          virtual_tour_url: string | null
        }
        Insert: {
          adapted_house?: boolean | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          building_year?: number | null
          built_in_wardrobes?: boolean | null
          city?: string | null
          condition?: string | null
          construction_area?: number | null
          created_at?: string | null
          description?: string | null
          descriptions?: Json | null
          divisions?: Json | null
          duplex?: boolean | null
          elevator?: boolean | null
          energy_class?: string | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          floor_plans?: string[] | null
          garden?: boolean | null
          heating_type?: string | null
          id?: string | null
          images?: string[] | null
          is_top_floor?: boolean | null
          location?: string | null
          lot_area?: number | null
          luxury_house?: boolean | null
          operation_rent?: boolean | null
          operation_sale?: boolean | null
          orientation_east?: boolean | null
          orientation_north?: boolean | null
          orientation_south?: boolean | null
          orientation_west?: boolean | null
          parking?: boolean | null
          penthouse?: boolean | null
          pool?: boolean | null
          price?: number | null
          private_area?: number | null
          property_type?: string | null
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          t0?: boolean | null
          title?: string | null
          total_floors?: number | null
          transaction_type?: string | null
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Update: {
          adapted_house?: boolean | null
          air_conditioning?: boolean | null
          balcony_terrace?: boolean | null
          bathrooms?: number | null
          bedrooms?: string | null
          building_year?: number | null
          built_in_wardrobes?: boolean | null
          city?: string | null
          condition?: string | null
          construction_area?: number | null
          created_at?: string | null
          description?: string | null
          descriptions?: Json | null
          divisions?: Json | null
          duplex?: boolean | null
          elevator?: boolean | null
          energy_class?: string | null
          featured?: boolean | null
          floor?: number | null
          floor_plan_url?: string | null
          floor_plans?: string[] | null
          garden?: boolean | null
          heating_type?: string | null
          id?: string | null
          images?: string[] | null
          is_top_floor?: boolean | null
          location?: string | null
          lot_area?: number | null
          luxury_house?: boolean | null
          operation_rent?: boolean | null
          operation_sale?: boolean | null
          orientation_east?: boolean | null
          orientation_north?: boolean | null
          orientation_south?: boolean | null
          orientation_west?: boolean | null
          parking?: boolean | null
          penthouse?: boolean | null
          pool?: boolean | null
          price?: number | null
          private_area?: number | null
          property_type?: string | null
          sea_view?: boolean | null
          status?: string | null
          storage?: boolean | null
          t0?: boolean | null
          title?: string | null
          total_floors?: number | null
          transaction_type?: string | null
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
      public_user_profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      quiz_answers_public: {
        Row: {
          answer_text: string | null
          id: string | null
          question_id: string | null
        }
        Insert: {
          answer_text?: string | null
          id?: string | null
          question_id?: string | null
        }
        Update: {
          answer_text?: string | null
          id?: string | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      admin_get_property: {
        Args: { _id: string }
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "properties"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_properties: {
        Args: never
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "properties"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_custom_quote_request: {
        Args: {
          _budget?: string
          _currency?: string
          _deposit_amount?: number
          _destination_slug?: string
          _destinations?: string[]
          _email: string
          _extras_slugs?: string[]
          _first_name: string
          _last_name: string
          _nationality?: string
          _notes?: string
          _num_days?: number
          _num_guests?: number
          _payload?: Json
          _phone?: string
          _start_tour_date_id?: string
          _total_amount?: number
        }
        Returns: string
      }
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
