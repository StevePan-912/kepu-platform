/**
 * 数据聚合工具函数
 * 提供趋势计算、分布分析、环比/同比等通用统计能力
 * 供成员3（中端数据层）和成员4（管理后台图表）使用
 */

// ============================================================
// 时间序列聚合
// ============================================================

/**
 * 将带 created_at 字段的记录按日期分组计数
 * 并补全指定天数范围内缺失日期（补 0）
 */
export function groupByDate(
  records: { created_at: string }[],
  days: number
): { date: string; count: number }[] {
  const countMap = new Map<string, number>()
  for (const r of records) {
    const date = r.created_at.split('T')[0]
    countMap.set(date, (countMap.get(date) ?? 0) + 1)
  }

  const result: { date: string; count: number }[] = []
  for (let i = 0; i <= days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - days + i)
    const dateStr = d.toISOString().split('T')[0]
    result.push({ date: dateStr, count: countMap.get(dateStr) ?? 0 })
  }
  return result
}

/**
 * 将记录按指定字段分组并计数，返回降序排列结果
 */
export function groupByField<T extends Record<string, unknown>>(
  records: T[],
  field: keyof T
): { value: string; count: number }[] {
  const countMap = new Map<string, number>()
  for (const r of records) {
    const val = String(r[field] ?? '未知')
    countMap.set(val, (countMap.get(val) ?? 0) + 1)
  }
  return Array.from(countMap.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 在日期序列上计算滚动累计值
 */
export function cumulativeSum(
  series: { date: string; count: number }[]
): { date: string; count: number; cumulative: number }[] {
  let acc = 0
  return series.map((item) => {
    acc += item.count
    return { ...item, cumulative: acc }
  })
}

// ============================================================
// 比率与分布
// ============================================================

/**
 * 将计数 Map 转为带百分比的分布数组
 */
export function toDistribution(
  countMap: Record<string, number>
): { label: string; count: number; percentage: number }[] {
  const total = Object.values(countMap).reduce((s, v) => s + v, 0)
  return Object.entries(countMap)
    .map(([label, count]) => ({
      label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 计算环比增长率（当期 vs 上期）
 * @returns 增长率百分比，精确到一位小数；上期为0时返回 null
 */
export function calcGrowthRate(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/**
 * 将时间序列按前半段/后半段切分，计算环比增长
 * 常用于「近7天 vs 上7天」对比
 */
export function calcPeriodGrowth(series: { count: number }[]): {
  currentTotal: number
  previousTotal: number
  growthRate: number | null
} {
  const half = Math.floor(series.length / 2)
  const previousTotal = series.slice(0, half).reduce((s, i) => s + i.count, 0)
  const currentTotal = series.slice(half).reduce((s, i) => s + i.count, 0)
  return {
    currentTotal,
    previousTotal,
    growthRate: calcGrowthRate(currentTotal, previousTotal),
  }
}

// ============================================================
// 排行榜工具
// ============================================================

/**
 * 从记录数组中取 TopN，支持自定义排序 key
 */
export function topN<T>(
  records: T[],
  key: keyof T,
  n: number,
  order: 'desc' | 'asc' = 'desc'
): T[] {
  return [...records]
    .sort((a, b) => {
      const va = Number(a[key])
      const vb = Number(b[key])
      return order === 'desc' ? vb - va : va - vb
    })
    .slice(0, n)
}

// ============================================================
// 时间区间辅助
// ============================================================

/**
 * 获取 N 天前的 ISO 字符串（用于 Supabase .gte() 参数）
 */
export function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/**
 * 格式化为 YYYY-MM-DD 日期字符串（中国时区 UTC+8）
 */
export function toLocalDateStr(isoString: string): string {
  const d = new Date(isoString)
  const offset = 8 * 60  // UTC+8
  const localMs = d.getTime() + offset * 60 * 1000
  return new Date(localMs).toISOString().split('T')[0]
}

/**
 * 判断是否在指定天数内活跃（用于「活跃用户」统计）
 */
export function isActiveWithinDays(lastActiveAt: string | null, days: number): boolean {
  if (!lastActiveAt) return false
  const threshold = new Date()
  threshold.setDate(threshold.getDate() - days)
  return new Date(lastActiveAt) > threshold
}
