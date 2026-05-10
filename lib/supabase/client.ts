import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// 客户端惰性初始化（避免在模块加载时调用 createClient）
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Supabase] 环境变量未配置，请检查 .env.local 文件')
    }
  }

  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcyMTI1NDAsImV4cCI6MjAzMjc4ODU0MH0.placeholder',
  )
}

// 惰性代理：仅在首次访问属性时才创建客户端，避免构建时触发 createClient
// 类型设为 any，等成员1提供 Database schema 后再补严格类型
export const supabase: any = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})

// 服务端客户端工厂函数（API Routes / Server Actions 使用）
// 使用 service_role key，绕过 RLS，仅在服务端调用
let _serverClient: ReturnType<typeof createClient> | null = null

export function createServerClient() {
  if (!_serverClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('[Supabase] SUPABASE_SERVICE_ROLE_KEY 未配置，无法创建服务端客户端')
    }

    _serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _serverClient
}

// 带用户 JWT 的服务端客户端（用于在服务端代表用户执行操作，遵守 RLS）
export const createUserServerClient = (accessToken: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcyMTI1NDAsImV4cCI6MjAzMjc4ODU0MH0.placeholder',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
