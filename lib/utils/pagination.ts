/**
 * 通用分页工具
 * 供所有需要分页的查询/接口使用
 */

export interface PageParams {
  page?: number      // 从 1 开始
  pageSize?: number  // 每页条数
}

export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PageMeta
}

/**
 * 将原始数组分页（内存分页，适合数据量较小的场景）
 */
export function paginateArray<T>(
  items: T[],
  params: PageParams = {}
): PaginatedResult<T> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(200, Math.max(1, params.pageSize ?? 20))
  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * 从查询参数（URL searchParams）解析分页参数
 * 供 API Route 使用：const { page, pageSize } = parsePageParams(searchParams)
 */
export function parsePageParams(
  searchParams: URLSearchParams,
  defaults: PageParams = {}
): Required<PageParams> {
  const page = parseInt(searchParams.get('page') ?? String(defaults.page ?? 1), 10)
  const pageSize = parseInt(searchParams.get('pageSize') ?? String(defaults.pageSize ?? 20), 10)
  return {
    page: Math.max(1, isNaN(page) ? 1 : page),
    pageSize: Math.min(200, Math.max(1, isNaN(pageSize) ? 20 : pageSize)),
  }
}

/**
 * 将 page/pageSize 转换为 Supabase .range() 的 [from, to] 参数
 */
export function toSupabaseRange(
  page: number,
  pageSize: number
): [number, number] {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return [from, to]
}

/**
 * 构造分页 Meta 对象（用于从 Supabase count 生成 meta）
 */
export function buildPageMeta(
  page: number,
  pageSize: number,
  total: number
): PageMeta {
  const totalPages = Math.ceil(total / pageSize)
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
