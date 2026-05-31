// @ts-nocheck
/**
 * Edge Function: auto-points
 * 数据库 Webhook 触发：当 user_activities 插入新记录时自动奖励积分
 *
 * 部署命令：
 *   supabase functions deploy auto-points --no-verify-jwt
 *
 * 积分规则：
 *   - search（搜索）: +1
 *   - view_resource（浏览资源）: +2
 *   - scan_ar（AR扫码）: +5
 *   - activity_join（参与活动）: +10
 *   - feedback（提交反馈）: +3
 *   - play_audio（播放音频）: +1
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase 配置（从环境变量读取）
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 积分奖励映射
const POINTS_MAP: Record<string, number> = {
  search: 1,
  view_resource: 2,
  scan_ar: 5,
  activity_join: 10,
  feedback: 3,
  play_audio: 1,
}

// 每日奖励上限
const DAILY_MAX_POINTS = 50

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json()
    const record = payload.record

    if (!record || !record.user_id || !record.action_type) {
      return new Response(JSON.stringify({ message: '无效记录' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const points = POINTS_MAP[record.action_type] ?? 0
    if (points <= 0) {
      return new Response(JSON.stringify({ message: '无需积分奖励', action_type: record.action_type }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 检查今日已获得积分（防刷）
    const todayStart = new Date().toISOString().split('T')[0] + 'T00:00:00Z'
    const { data: todayRecords } = await supabase
      .from('point_records')
      .select('points')
      .eq('user_id', record.user_id)
      .gte('created_at', todayStart)

    const todayEarned = (todayRecords ?? [])
      .filter((r) => r.points > 0)
      .reduce((s, r) => s + r.points, 0)

    if (todayEarned >= DAILY_MAX_POINTS) {
      return new Response(
        JSON.stringify({ message: '已达每日积分上限', today_earned: todayEarned }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 写入积分记录
    const actualPoints = Math.min(points, DAILY_MAX_POINTS - todayEarned)
    const description = getPointDescription(record.action_type)

    const { error: pointError } = await supabase
      .from('point_records')
      .insert({
        user_id: record.user_id,
        points: actualPoints,
        description,
        source: record.action_type,
      })

    if (pointError) throw pointError

    // 更新用户总积分
    const { error: userError } = await supabase.rpc('increment_points', {
      user_id: record.user_id,
      amount: actualPoints,
    })

    if (userError) {
      // 回退到直接更新
      await supabase
        .from('users')
        .update({ points: supabase.raw(`points + ${actualPoints}`) } as never)
        .eq('id', record.user_id)
    }

    return new Response(
      JSON.stringify({
        message: '积分奖励成功',
        points: actualPoints,
        action_type: record.action_type,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('auto-points error:', err)
    return new Response(
      JSON.stringify({ message: '内部错误', error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function getPointDescription(actionType: string): string {
  const map: Record<string, string> = {
    search: '搜索科普内容',
    view_resource: '浏览科普资源',
    scan_ar: 'AR探境体验',
    activity_join: '参与社区活动',
    feedback: '提交反馈建议',
    play_audio: '收听音频讲解',
  }
  return map[actionType] ?? '科普互动'
}
