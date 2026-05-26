/**
 * 简易内存速率限制器
 * 用于 API Route 层的请求频率控制
 *
 * 注意：
 * - 此实现基于内存 Map，适用于单实例部署（Vercel Serverless）
 * - 多实例部署建议使用 Redis 或 Supabase 实现分布式限流
 * - Vercel 生产环境可配合 Vercel Edge Config 或外部 Redis
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/** 定期清理过期条目（每60秒） */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 60_000)
}

interface RateLimitOptions {
  /** 时间窗口内允许的最大请求数 */
  maxRequests?: number
  /** 时间窗口（秒） */
  windowSeconds?: number
  /** 标识符（默认取 IP） */
  identifier?: string
}

interface RateLimitResult {
  /** 是否被限制 */
  limited: boolean
  /** 当前窗口内已使用请求数 */
  current: number
  /** 窗口内允许的最大值 */
  limit: number
  /** 剩余请求数 */
  remaining: number
  /** 重置剩余秒数 */
  resetInSeconds: number
}

/**
 * 检查是否超过速率限制
 *
 * @example
 * const result = checkRateLimit({ identifier: ip, maxRequests: 60, windowSeconds: 60 })
 * if (result.limited) {
 *   return NextResponse.json(apiError('请求过于频繁'), { status: 429 })
 * }
 */
export function checkRateLimit(
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    maxRequests = 60,
    windowSeconds = 60,
    identifier = 'global',
  } = options

  const now = Date.now()
  const key = `rate:${identifier}`
  const entry = store.get(key)

  // 新窗口或过期
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    }
    store.set(key, newEntry)
    return {
      limited: false,
      current: 1,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds,
    }
  }

  // 窗口内递增
  entry.count += 1
  const remaining = Math.max(0, maxRequests - entry.count)
  const resetInMs = Math.max(0, entry.resetAt - now)

  return {
    limited: entry.count > maxRequests,
    current: entry.count,
    limit: maxRequests,
    remaining,
    resetInSeconds: Math.ceil(resetInMs / 1000),
  }
}

/**
 * 从 NextRequest 提取标识符（IP + 路径组合）
 */
export function getRateLimitIdentifier(
  request: Request,
  path = ''
): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown'
  return `${ip}:${path}`
}

// ============================================================
// 预设限流规则
// ============================================================

/** 预设：一般 API 请求 60次/分钟 */
export const RATE_LIMIT_GENERAL = { maxRequests: 60, windowSeconds: 60 }

/** 预设：认证接口 5次/分钟（防暴力破解） */
export const RATE_LIMIT_AUTH = { maxRequests: 5, windowSeconds: 60 }

/** 预设：上传接口 10次/分钟 */
export const RATE_LIMIT_UPLOAD = { maxRequests: 10, windowSeconds: 60 }
