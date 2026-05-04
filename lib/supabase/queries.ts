import { supabase } from './client'
import type { Resource, Device, UserActivity, HotWord, DecisionSuggestion, Product, User } from './types'

// 获取科普资源列表
export async function getResources(category?: string) {
  const query = supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (category) {
    query.eq('category', category)
  }
  return query
}

// 获取单个资源详情
export async function getResourceById(id: string) {
  return supabase.from('resources').select('*').eq('id', id).single()
}

// 获取装置点位列表
export async function getDevices(status?: string) {
  const query = supabase.from('devices').select('*').order('name')
  if (status) {
    query.eq('status', status)
  }
  return query
}

// 获取单个装置详情
export async function getDeviceById(id: string) {
  return supabase.from('devices').select('*').eq('id', id).single()
}

// 记录用户行为
export async function recordActivity(activity: Partial<UserActivity>) {
  return supabase.from('user_activities').insert(activity)
}

// 获取用户行为历史
export async function getUserActivities(userId: string, limit = 50) {
  return supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

// 获取热词排行
export async function getHotWords(period = 'weekly', limit = 30) {
  return supabase
    .from('hot_words')
    .select('*')
    .eq('period', period)
    .order('count', { ascending: false })
    .limit(limit)
}

// 获取决策建议
export async function getDecisionSuggestions(type?: string) {
  const query = supabase
    .from('decision_suggestions')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
  if (type) {
    query.eq('type', type)
  }
  return query
}

// 获取积分商品列表
export async function getProducts(category?: string) {
  const query = supabase.from('products').select('*').gt('stock', 0).order('points_required')
  if (category) {
    query.eq('category', category)
  }
  return query
}

// 获取用户信息
export async function getUserById(id: string) {
  return supabase.from('users').select('*').eq('id', id).single()
}

// 更新用户积分
export async function updateUserPoints(userId: string, pointsToAdd: number, reason: string) {
  const { data: user } = await getUserById(userId)
  if (!user) return { error: 'User not found' }

  const { error: updateError } = await supabase
    .from('users')
    .update({ points: user.points + pointsToAdd })
    .eq('id', userId)

  if (updateError) return { error: updateError }

  return supabase.from('point_records').insert({
    user_id: userId,
    points: pointsToAdd,
    reason
  })
}

// 获取用户积分记录
export async function getPointRecords(userId: string, limit = 20) {
  return supabase
    .from('point_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

// 创建兑换记录
export async function createExchange(userId: string, productId: string) {
  const { data: product } = await supabase.from('products').select('*').eq('id', productId).single()
  if (!product) return { error: 'Product not found' }

  const { data: user } = await getUserById(userId)
  if (!user || user.points < product.points_required) {
    return { error: 'Insufficient points' }
  }

  await supabase.from('users').update({ points: user.points - product.points_required }).eq('id', userId)
  await supabase.from('products').update({ stock: product.stock - 1 }).eq('id', productId)

  return supabase.from('exchanges').insert({
    user_id: userId,
    product_id: productId,
    points_spent: product.points_required,
    status: 'pending'
  })
}

// 获取用户兑换记录
export async function getUserExchanges(userId: string) {
  return supabase
    .from('exchanges')
    .select('*, products(name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

// 获取志愿者任务列表
export async function getVolunteerTasks(status?: string) {
  const query = supabase.from('volunteer_tasks').select('*').order('created_at', { ascending: false })
  if (status) {
    query.eq('status', status)
  }
  return query
}

// 获取统计数据 - 活跃度
export async function getActivityStats(days = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return supabase
    .from('user_activities')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
}