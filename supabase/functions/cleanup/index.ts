// @ts-nocheck
/**
 * Edge Function: cleanup
 * 定时清理过期数据
 *
 * 部署命令：
 *   supabase functions deploy cleanup --no-verify-jwt
 *
 * Cron 配置：
 *   select cron.schedule('cleanup-old-data', '0 3 * * 0', 'https://xxx.functions.supabase.co/cleanup')
 *   （每周日凌晨3点执行）
 *
 * 清理策略：
 *   - user_activities：保留最近90天
 *   - hot_words：重置日榜（保留30天）
 *   - point_records：保留最近180天
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface CleanupResult {
  table: string
  deleted: number
  error: string | null
}

Deno.serve(async (_req: Request) => {
  const results: CleanupResult[] = []

  try {
    // 1. 清理90天前的用户行为记录
    const activityCutoff = new Date()
    activityCutoff.setDate(activityCutoff.getDate() - 90)

    const { count: activityCount, error: activityErr } = await supabase
      .from('user_activities')
      .delete({ count: 'exact' })
      .lt('created_at', activityCutoff.toISOString())

    results.push({
      table: 'user_activities',
      deleted: activityCount ?? 0,
      error: activityErr?.message ?? null,
    })

    // 2. 清理30天前的日榜热词
    const hotWordCutoff = new Date()
    hotWordCutoff.setDate(hotWordCutoff.getDate() - 30)

    const { count: hotWordCount, error: hotWordErr } = await supabase
      .from('hot_words')
      .delete({ count: 'exact' })
      .eq('period', 'daily')
      .lt('stat_date', hotWordCutoff.toISOString().split('T')[0])

    results.push({
      table: 'hot_words',
      deleted: hotWordCount ?? 0,
      error: hotWordErr?.message ?? null,
    })

    // 3. 清理180天前的积分记录（保留汇总数据）
    const pointCutoff = new Date()
    pointCutoff.setDate(pointCutoff.getDate() - 180)

    const { count: pointCount, error: pointErr } = await supabase
      .from('point_records')
      .delete({ count: 'exact' })
      .lt('created_at', pointCutoff.toISOString())

    results.push({
      table: 'point_records',
      deleted: pointCount ?? 0,
      error: pointErr?.message ?? null,
    })

    const totalDeleted = results.reduce((s, r) => s + r.deleted, 0)
    const hasErrors = results.some((r) => r.error)

    return new Response(
      JSON.stringify({
        message: hasErrors ? '清理完成（部分错误）' : '清理完成',
        total_deleted: totalDeleted,
        details: results,
      }),
      { status: hasErrors ? 207 : 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('cleanup error:', err)
    return new Response(
      JSON.stringify({ message: '清理失败', error: String(err), details: results }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
