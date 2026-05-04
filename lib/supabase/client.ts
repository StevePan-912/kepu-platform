import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase环境变量未配置，请检查.env.local文件')
}

// 使用宽松类型以避免严格的类型检查问题
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// 服务端客户端（用于管理后台）
export const createServerClient = () => {
  return createClient(
    supabaseUrl || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    { auth: { persistSession: false } }
  )
}