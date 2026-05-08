import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] 环境变量未配置，请检查 .env.local 文件')
  }
}

// 客户端单例（前端组件 / Client Components 使用）
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// 服务端客户端工厂函数（API Routes / Server Actions 使用）
// 使用 service_role key，绕过 RLS，仅在服务端调用
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('[Supabase] SUPABASE_SERVICE_ROLE_KEY 未配置，无法创建服务端客户端')
  }
  return createClient<Database>(
    supabaseUrl || '',
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

// 带用户 JWT 的服务端客户端（用于在服务端代表用户执行操作，遵守 RLS）
export const createUserServerClient = (accessToken: string) => {
  return createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || '',
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
