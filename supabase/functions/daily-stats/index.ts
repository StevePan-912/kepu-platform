/**
 * Edge Function: daily-stats
 * 定时任务：每日聚合统计数据，写入 stats_daily 表
 *
 * 部署命令：
 *   supabase functions deploy daily-stats --no-verify-jwt
 *
 * Cron 配置（Supabase Dashboard → Database → Cron）：
 *   select cron.schedule('daily-stats', '0 1 * * *', 'https://xxx.functions.supabase.co/daily-stats')
 *
 * 统计维度：
 *   - 活跃用户数
 *   - 总活动次数
 *   - 新增用户数
 *   - 积分发放/消费总额
 *   - 兑换次数
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (_req: Request) => {
  try {
    // 统计昨天（UTC+8 中国时区）
    const now = new Date()
    const offsetMs = 8 * 60 * 60 * 1000
    const localNow = new Date(now.getTime() + offsetMs)
    const yesterday = new Date(localNow)
    yesterday.setDate(yesterday.getDate() - 1)

    const statDate = yesterday.toISOString().split('T')[0]
    const dayStart = `${statDate}T00:00:00+08:00`
    const dayEnd = `${statDate}T23:59:59+08:00`

    // 并行查询各维度数据
    const [
      activeUsersRes,
      activitiesRes,
      newUsersRes,
      pointsRes,
      exchangesRes,
    ] = await Promise.all([
      // 活跃用户（当天有行为记录的用户去重）
      supabase
        .from('user_activities')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      // 活动总数
      supabase
        .from('user_activities')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      // 新增用户
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      // 积分记录
      supabase
        .from('point_records')
        .select('points')
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      // 兑换次数
      supabase
        .from('exchanges')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),
    ])

    const pointRecords = pointsRes.data ?? []
    const earnedPoints = pointRecords
      .filter((r) => r.points > 0)
      .reduce((s, r) => s + r.points, 0)
    const spentPoints = pointRecords
      .filter((r) => r.points < 0)
      .reduce((s, r) => s + Math.abs(r.points), 0)

    // 活跃用户去重
    let activeUserCount = 0
    if (activeUsersRes.count !== null) {
      // count: 'exact' 模式下使用 count
      const { count } = await supabase
        .from('user_activities')
        .select('user_id')
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd)

      const uniqueUsers = new Set((count ?? []).map((r: { user_id: string }) => r.user_id))
      activeUserCount = uniqueUsers.size
    }

    // 写入统计表
    const { error: insertError } = await supabase
      .from('stats_daily')
      .upsert(
        {
          stat_date: statDate,
          active_users: activeUserCount,
          total_activities: activitiesRes.count ?? 0,
          new_users: newUsersRes.count ?? 0,
          earned_points: earnedPoints,
          spent_points: spentPoints,
          exchanges: exchangesRes.count ?? 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stat_date' }
      )

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({
        message: '日统计完成',
        stat_date: statDate,
        active_users: activeUserCount,
        total_activities: activitiesRes.count ?? 0,
        new_users: newUsersRes.count ?? 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('daily-stats error:', err)
    return new Response(
      JSON.stringify({ message: '统计失败', error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
