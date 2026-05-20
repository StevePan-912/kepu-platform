import { NextRequest, NextResponse } from 'next/server'
import { groupByField, topN, daysAgoISO } from '@/lib/utils/stats'
import { toDistribution } from '@/lib/utils/stats'
import { createServerClient } from '@/lib/supabase/client'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/stats/resources
 * 资源统计（分类分布 + 热门资源排行）
 * 公开接口，无需鉴权（展示在首页/大屏）
 * Query params:
 *   - days?: number  热门资源统计时间窗口，默认 7
 *   - top?: number   热门资源 TopN，默认 10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') ?? '7', 10), 90)
    const topCount = Math.min(parseInt(searchParams.get('top') ?? '10', 10), 50)

    const serviceClient = createServerClient()

    const [resourcesRes, activitiesRes] = await Promise.all([
      serviceClient.from('resources').select('id, title, category, type'),
      serviceClient
        .from('user_activities')
        .select('resource_id')
        .not('resource_id', 'is', null)
        .gte('created_at', daysAgoISO(days)),
    ])

    // 分类分布
    const catCountMap: Record<string, number> = {}
    const typeCountMap: Record<string, number> = {}
    for (const r of resourcesRes.data ?? []) {
      if (r.category) catCountMap[r.category] = (catCountMap[r.category] ?? 0) + 1
      if (r.type) typeCountMap[r.type] = (typeCountMap[r.type] ?? 0) + 1
    }

    // 热门资源（按活动次数统计）
    const viewCount: Record<string, number> = {}
    for (const act of activitiesRes.data ?? []) {
      if (act.resource_id) {
        viewCount[act.resource_id] = (viewCount[act.resource_id] ?? 0) + 1
      }
    }

    const resourceMap = new Map((resourcesRes.data ?? []).map((r) => [r.id, r]))
    const hotResources = Object.entries(viewCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topCount)
      .map(([id, views]) => ({ ...resourceMap.get(id), views }))
      .filter(Boolean)

    return NextResponse.json(apiSuccess({
      total: resourcesRes.data?.length ?? 0,
      category_distribution: toDistribution(catCountMap),
      type_distribution: toDistribution(typeCountMap),
      hot_resources: hotResources,
      period_days: days,
    }))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
