import { supabase } from './client'

// 手机号 + OTP 登录（发送验证码）
export async function signInWithPhone(phone: string) {
  return supabase.auth.signInWithOtp({
    phone,
    options: { channel: 'sms' },
  })
}

// 验证 OTP
export async function verifyOtp(phone: string, token: string) {
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
}

// 邮箱 + 密码登录（管理员使用）
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

// 登出
export async function signOut() {
  return supabase.auth.signOut()
}

// 获取当前会话
export async function getSession() {
  return supabase.auth.getSession()
}

// 获取当前用户
export async function getAuthUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 演示模式匿名登录（用于展示/体验）
export async function signInAnonymously() {
  return supabase.auth.signInAnonymously()
}
