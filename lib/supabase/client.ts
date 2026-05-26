import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * 通用客户端（匿名权限，使用 anon key）
 * 用于客户端组件和公开查询
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

/**
 * 服务端客户端（service_role 权限，绕过 RLS）
 * 仅用于服务端（API Route / Server Component / Edge Function）
 * 注意：此客户端拥有完全数据库权限，不可暴露到客户端
 */
export function createServerClient(): SupabaseClient<Database> {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 未设置')
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * 用户代理客户端（使用用户的 access_token）
 * 用于 API Route 中以用户身份执行操作
 * @param accessToken 用户 Supabase access_token（从 Authorization header 提取）
 */
export function createUserServerClient(
  accessToken: string
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * 懒加载单例客户端（用于需要延迟初始化的场景）
 * 避免在构建时触发 createClient()
 */
let _lazyClient: SupabaseClient<Database> | null = null
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!_lazyClient) {
    _lazyClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _lazyClient
}
