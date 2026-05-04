export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string | null
          nickname: string | null
          role: 'resident' | 'admin' | 'volunteer'
          points: number
          honor_level: 'explorer' | 'communicator' | 'leader' | null
          created_at: string
        }
        Insert: {
          id?: string
          phone?: string | null
          nickname?: string | null
          role?: 'resident' | 'admin' | 'volunteer'
          points?: number
          honor_level?: 'explorer' | 'communicator' | 'leader' | null
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          nickname?: string | null
          role?: 'resident' | 'admin' | 'volunteer'
          points?: number
          honor_level?: 'explorer' | 'communicator' | 'leader' | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          category: 'astronomy' | 'paleontology' | 'botany' | 'ecology' | 'neighborhood'
          type: 'audio' | 'video' | 'ar_model' | 'text'
          content_url: string | null
          duration_seconds: number | null
          description: string | null
          source_provider: string | null
          tags: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: 'astronomy' | 'paleontology' | 'botany' | 'ecology' | 'neighborhood'
          type?: 'audio' | 'video' | 'ar_model' | 'text'
          content_url?: string | null
          duration_seconds?: number | null
          description?: string | null
          source_provider?: string | null
          tags?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: 'astronomy' | 'paleontology' | 'botany' | 'ecology' | 'neighborhood'
          type?: 'audio' | 'video' | 'ar_model' | 'text'
          content_url?: string | null
          duration_seconds?: number | null
          description?: string | null
          source_provider?: string | null
          tags?: Json
          created_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          name: string
          location: string | null
          lat: number | null
          lng: number | null
          type: 'audio_station' | 'screen' | 'ar_point' | 'star_corner'
          status: 'online' | 'offline' | 'maintenance'
          battery_level: number
          last_active: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          lat?: number | null
          lng?: number | null
          type?: 'audio_station' | 'screen' | 'ar_point' | 'star_corner'
          status?: 'online' | 'offline' | 'maintenance'
          battery_level?: number
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          lat?: number | null
          lng?: number | null
          type?: 'audio_station' | 'screen' | 'ar_point' | 'star_corner'
          status?: 'online' | 'offline' | 'maintenance'
          battery_level?: number
          last_active?: string
          created_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string | null
          device_id: string | null
          resource_id: string | null
          action_type: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'activity_join'
          search_keyword: string | null
          duration_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          device_id?: string | null
          resource_id?: string | null
          action_type?: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'activity_join'
          search_keyword?: string | null
          duration_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          device_id?: string | null
          resource_id?: string | null
          action_type?: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'activity_join'
          search_keyword?: string | null
          duration_seconds?: number | null
          created_at?: string
        }
      }
      point_records: {
        Row: {
          id: string
          user_id: string | null
          points: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          points: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          points?: number
          reason?: string | null
          created_at?: string
        }
      }
      hot_words: {
        Row: {
          id: string
          word: string
          count: number
          period: 'daily' | 'weekly' | 'monthly'
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          count?: number
          period?: 'daily' | 'weekly' | 'monthly'
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          count?: number
          period?: 'daily' | 'weekly' | 'monthly'
          updated_at?: string
        }
      }
      decision_suggestions: {
        Row: {
          id: string
          type: 'activity' | 'content' | 'location'
          suggestion_text: string
          priority: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type?: 'activity' | 'content' | 'location'
          suggestion_text: string
          priority?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'activity' | 'content' | 'location'
          suggestion_text?: string
          priority?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          points_required: number
          image_url: string | null
          stock: number
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points_required: number
          image_url?: string | null
          stock?: number
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_required?: number
          image_url?: string | null
          stock?: number
          category?: string | null
          created_at?: string
        }
      }
      exchanges: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          points_spent: number | null
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          points_spent?: number | null
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          points_spent?: number | null
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      volunteer_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          points_reward: number | null
          status: 'open' | 'in_progress' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          points_reward?: number | null
          status?: 'open' | 'in_progress' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          points_reward?: number | null
          status?: 'open' | 'in_progress' | 'completed'
          created_at?: string
        }
      }
      volunteer_records: {
        Row: {
          id: string
          user_id: string | null
          task_id: string | null
          hours: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          task_id?: string | null
          hours?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          task_id?: string | null
          hours?: number | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// 导出常用类型
export type User = Database['public']['Tables']['users']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Device = Database['public']['Tables']['devices']['Row']
export type UserActivity = Database['public']['Tables']['user_activities']['Row']
export type PointRecord = Database['public']['Tables']['point_records']['Row']
export type HotWord = Database['public']['Tables']['hot_words']['Row']
export type DecisionSuggestion = Database['public']['Tables']['decision_suggestions']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Exchange = Database['public']['Tables']['exchanges']['Row']
export type VolunteerTask = Database['public']['Tables']['volunteer_tasks']['Row']
export type VolunteerRecord = Database['public']['Tables']['volunteer_records']['Row']