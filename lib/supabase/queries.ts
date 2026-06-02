import { supabase } from './client'
import type {
  Resource, Device, UserActivity, HotWord,
  DecisionSuggestion, Product, User
} from './types'

/** 检测 Supabase 是否已配置真实凭据（非占位符） */
export const isSupabaseConfigured = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return url.startsWith('https://') && !url.includes('placeholder')
})()

/** 未配置时的空返回 */
const EMPTY = { data: null, error: { message: 'Supabase not configured' } }
const EMPTY_LIST = { data: [], error: null }

// ============================================================
// 科普资源
// ============================================================
export async function getResources(category?: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  let query = supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (category) {
    query = query.eq('category', category)
  }
  return query
}

export async function getResourceById(id: string) {
  if (!isSupabaseConfigured) return EMPTY as { data: any; error: any }
  return supabase.from('resources').select('*').eq('id', id).single() as unknown as { data: any; error: any }
}

// ============================================================
// 设备点位
// ============================================================
export async function getDevices(status?: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  let query = supabase.from('devices').select('*').order('name')
  if (status) {
    query = query.eq('status', status)
  }
  return query
}

export async function getDeviceById(id: string) {
  if (!isSupabaseConfigured) return EMPTY as { data: any; error: any }
  return supabase.from('devices').select('*').eq('id', id).single() as unknown as { data: any; error: any }
}

// ============================================================
// 用户行为
// ============================================================
export async function recordActivity(activity: Partial<UserActivity>) {
  if (!isSupabaseConfigured) return EMPTY as any
  return (supabase.from('user_activities') as any).insert(activity as UserActivity)
}

export async function getUserActivities(userId: string, limit = 50) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  return supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function getActivityStats(days = 7) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  return supabase
    .from('user_activities')
    .select('created_at, action')
    .gte('created_at', startDate.toISOString())
}

// ============================================================
// 热词
// ============================================================
export async function getHotWords(period = 'weekly', limit = 30) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  return supabase
    .from('hot_words')
    .select('*')
    .eq('period', period)
    .order('count', { ascending: false })
    .limit(limit)
}

export async function upsertHotWord(word: string, period = 'daily') {
  if (!isSupabaseConfigured) return EMPTY as any
  const today = new Date().toISOString().split('T')[0]
  const { data: existing } = await supabase
    .from('hot_words')
    .select('id, count')
    .eq('word', word)
    .eq('period', period)
    .eq('stat_date', today)
    .single() as unknown as { data: any; error: any }

  if (existing) {
    return (supabase
      .from('hot_words') as any)
      .update({ count: existing.count + 1 })
      .eq('id', existing.id)
  } else {
    return (supabase
      .from('hot_words') as any)
      .insert({ word, period, stat_date: today, count: 1 })
  }
}

// ============================================================
// 用户信息
// ============================================================
export async function getUserById(id: string) {
  if (!isSupabaseConfigured) return EMPTY as { data: any; error: any }
  return supabase.from('users').select('*').eq('id', id).single() as unknown as { data: any; error: any }
}

export async function upsertUser(userData: Partial<User> & { id: string }) {
  if (!isSupabaseConfigured) return EMPTY as any
  return (supabase.from('users') as any).upsert(userData, { onConflict: 'id' })
}

// ============================================================
// 积分系统
// ============================================================
export async function updateUserPoints(userId: string, pointsToAdd: number, reason: string) {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }

  const { data: user, error: fetchError } = await getUserById(userId)
  if (fetchError || !user) return { error: fetchError || new Error('User not found') }

  const newPoints = user.points + pointsToAdd
  if (newPoints < 0) return { error: new Error('积分不足') }

  const { error: updateError } = await (supabase
    .from('users') as any)
    .update({ points: newPoints })
    .eq('id', userId)

  if (updateError) return { error: updateError }

  const { error: recordError } = await (supabase.from('point_records') as any).insert({
    user_id: userId,
    points: pointsToAdd,
    reason,
  })

  return { error: recordError, data: { newPoints } }
}

export async function getPointRecords(userId: string, limit = 20) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  return supabase
    .from('point_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

// ============================================================
// 积分商城
// ============================================================
export async function getProducts(category?: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  let query = supabase.from('products').select('*').gt('stock', 0).eq('is_active', true).order('points_required')
  if (category) {
    query = query.eq('category', category)
  }
  return query
}

export async function createExchange(userId: string, productId: string) {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }

  const { data: product, error: pErr } = await supabase
    .from('products').select('*').eq('id', productId).single() as unknown as { data: any; error: any }
  if (pErr || !product) return { error: pErr || new Error('商品不存在') }
  if (product.stock <= 0) return { error: new Error('商品库存不足') }

  const { data: user, error: uErr } = await getUserById(userId)
  if (uErr || !user) return { error: uErr || new Error('用户不存在') }
  if (user.points < product.points_required) return { error: new Error('积分不足') }

  const pointsResult = await updateUserPoints(userId, -product.points_required, `兑换商品：${product.name}`)
  if (pointsResult.error) return { error: pointsResult.error }

  const { error: stockErr } = await (supabase
    .from('products') as any)
    .update({ stock: product.stock - 1 })
    .eq('id', productId)
  if (stockErr) return { error: stockErr }

  return (supabase.from('exchanges') as any).insert({
    user_id: userId,
    product_id: productId,
    points_spent: product.points_required,
    status: 'pending',
  }).select().single() as unknown as { data: any; error: any }
}

export async function getUserExchanges(userId: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  return supabase
    .from('exchanges')
    .select('*, products(name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

// ============================================================
// 志愿者
// ============================================================
export async function getVolunteerTasks(status?: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  let query = supabase.from('volunteer_tasks').select('*').order('created_at', { ascending: false })
  if (status) {
    query = query.eq('status', status)
  }
  return query
}

export async function joinVolunteerTask(userId: string, taskId: string) {
  if (!isSupabaseConfigured) return EMPTY as any
  return (supabase.from('volunteer_records') as any).insert({
    user_id: userId,
    task_id: taskId,
    status: 'registered',
  })
}

export async function getUserVolunteerRecords(userId: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  return supabase
    .from('volunteer_records')
    .select('*, volunteer_tasks(title, reward_points)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

// ============================================================
// 决策建议
// ============================================================
export async function getDecisionSuggestions(type?: string) {
  if (!isSupabaseConfigured) return EMPTY_LIST as any
  let query = supabase
    .from('decision_suggestions')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
  if (type) {
    query = query.eq('type', type)
  }
  return query
}
