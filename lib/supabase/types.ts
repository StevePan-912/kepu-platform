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
          role: string
          points: number
          honor_level: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone?: string | null
          nickname?: string | null
          role?: string
          points?: number
          honor_level?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          nickname?: string | null
          role?: string
          points?: number
          honor_level?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: string
          title: string
          category: string | null
          type: string | null
          content_url: string | null
          duration: number | null
          description: string | null
          source: string | null
          tags: Json | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          category?: string | null
          type?: string | null
          content_url?: string | null
          duration?: number | null
          description?: string | null
          source?: string | null
          tags?: Json | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string | null
          type?: string | null
          content_url?: string | null
          duration?: number | null
          description?: string | null
          source?: string | null
          tags?: Json | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          id: string
          name: string
          type: string | null
          status: string
          latitude: number | null
          longitude: number | null
          battery_level: number | null
          last_active_at: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          type?: string | null
          status?: string
          latitude?: number | null
          longitude?: number | null
          battery_level?: number | null
          last_active_at?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          status?: string
          latitude?: number | null
          longitude?: number | null
          battery_level?: number | null
          last_active_at?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          action: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'join_activity' | 'view_resource'
          resource_id: string | null
          device_id: string | null
          keyword: string | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          action?: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'join_activity'
          resource_id?: string | null
          device_id?: string | null
          keyword?: string | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'join_activity'
          resource_id?: string | null
          device_id?: string | null
          keyword?: string | null
          duration?: number | null
          created_at?: string
        }
        Relationships: []
      }
      hot_words: {
        Row: {
          id: string
          word: string
          count: number
          period: string
          stat_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word?: string
          count?: number
          period?: string
          stat_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          count?: number
          period?: string
          stat_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      point_records: {
        Row: {
          id: string
          user_id: string
          points: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          reason?: string
          created_at?: string
        }
        Relationships: []
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
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          description?: string | null
          points_required: number
          image_url?: string | null
          stock?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_required?: number
          image_url?: string | null
          stock?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exchanges: {
        Row: {
          id: string
          user_id: string
          product_id: string
          points_spent: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          points_spent: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          points_spent?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          reward_points: number
          status: string
          max_volunteers: number
          start_time: string | null
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          description?: string | null
          reward_points?: number
          status?: string
          max_volunteers?: number
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          reward_points?: number
          status?: string
          max_volunteers?: number
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_records: {
        Row: {
          id: string
          user_id: string
          task_id: string
          service_hours: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          service_hours?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          service_hours?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      decision_suggestions: {
        Row: {
          id: string
          type: string
          suggestion: string
          priority: number
          is_active: boolean
          data_snapshot: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          suggestion: string
          priority?: number
          is_active?: boolean
          data_snapshot?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          suggestion?: string
          priority?: number
          is_active?: boolean
          data_snapshot?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      device_alerts: {
        Row: {
          id: string
          device_id: string
          alert_type: string | null
          message: string | null
          status: string
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          device_id: string
          alert_type?: string | null
          message?: string | null
          status?: string
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          device_id?: string
          alert_type?: string | null
          message?: string | null
          status?: string
          created_at?: string
          resolved_at?: string | null
        }
        Relationships: []
      }
      stats_daily: {
        Row: {
          id: string
          metric_date: string | null
          metric_type: string | null
          metric_key: string | null
          metric_value: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          metric_date?: string | null
          metric_type?: string | null
          metric_key?: string | null
          metric_value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          metric_date?: string | null
          metric_type?: string | null
          metric_key?: string | null
          metric_value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Device = Database['public']['Tables']['devices']['Row']
export type UserActivity = Database['public']['Tables']['user_activities']['Row']
export type HotWord = Database['public']['Tables']['hot_words']['Row']
export type PointRecord = Database['public']['Tables']['point_records']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Exchange = Database['public']['Tables']['exchanges']['Row']
export type VolunteerTask = Database['public']['Tables']['volunteer_tasks']['Row']
export type VolunteerRecord = Database['public']['Tables']['volunteer_records']['Row']
export type DecisionSuggestion = Database['public']['Tables']['decision_suggestions']['Row']
export type DeviceAlert = Database['public']['Tables']['device_alerts']['Row']
export type StatsDaily = Database['public']['Tables']['stats_daily']['Row']
