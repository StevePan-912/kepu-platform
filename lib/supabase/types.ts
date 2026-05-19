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
        Row: { id: string; title: string; category: string; type: string; content_url: string | null; duration_seconds: number | null; description: string | null }
      }
      devices: {
        Row: { id: string; name: string; type: string; status: string; lat: number; lng: number }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          action_type: string
          search_keyword: string | null
          duration_seconds: number | null
          created_at: string
        }
      }
      point_records: {
        Row: {
          id: string
          user_id: string
          points: number
          reason: string
          created_at: string
        }
      }
      products: {
        Row: { id: string; name: string; points_cost: number; stock: number }
      }
      exchanges: {
        Row: {
          id: string
          user_id: string
          product_id: string
          points_spent: number
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
      }
      volunteer_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          points_reward: number
          status: 'open' | 'in_progress' | 'completed'
          created_at: string
        }
      }
      volunteer_records: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          hours: number
          description: string | null
          created_at: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Device = Database['public']['Tables']['devices']['Row']
export type UserActivity = Database['public']['Tables']['user_activities']['Row']
export type PointRecord = Database['public']['Tables']['point_records']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Exchange = Database['public']['Tables']['exchanges']['Row']
export type VolunteerTask = Database['public']['Tables']['volunteer_tasks']['Row']
export type VolunteerRecord = Database['public']['Tables']['volunteer_records']['Row']
