/**
 * lib/utils/pagination.ts 单元测试
 * 覆盖：paginateArray、parsePageParams、toSupabaseRange、buildPageMeta
 */
import { describe, it, expect } from 'vitest'
import {
  paginateArray,
  parsePageParams,
  toSupabaseRange,
  buildPageMeta,
} from '@/lib/utils/pagination'

describe('paginateArray', () => {
  const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))

  it('should paginate with page/pageSize', () => {
    const result = paginateArray(items, { page: 2, pageSize: 10 })
    expect(result.data).toHaveLength(10)
    expect(result.data[0].id).toBe(11)
    expect(result.totalPages).toBe(5)
    expect(result.total).toBe(50)
  })

  it('should return empty for page beyond range', () => {
    const result = paginateArray(items, { page: 10, pageSize: 10 })
    expect(result.data).toHaveLength(0)
    expect(result.totalPages).toBe(5)
  })

  it('should handle single page', () => {
    const result = paginateArray(items, { page: 1, pageSize: 100 })
    expect(result.data).toHaveLength(50)
    expect(result.totalPages).toBe(1)
  })

  it('should use defaults (page=1, pageSize=20)', () => {
    const result = paginateArray(items, {})
    expect(result.data).toHaveLength(20)
    expect(result.page).toBe(1)
  })

  it('should handle empty array', () => {
    const result = paginateArray([], { page: 1, pageSize: 10 })
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(0)
  })
})

describe('parsePageParams', () => {
  it('should parse valid searchParams', () => {
    const searchParams = new URLSearchParams('page=3&pageSize=25')
    const result = parsePageParams(searchParams)
    expect(result.page).toBe(3)
    expect(result.pageSize).toBe(25)
  })

  it('should use defaults for missing params', () => {
    const searchParams = new URLSearchParams('')
    const result = parsePageParams(searchParams)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })

  it('should clamp pageSize to max', () => {
    const searchParams = new URLSearchParams('pageSize=500')
    const result = parsePageParams(searchParams)
    expect(result.pageSize).toBeLessThanOrEqual(100)
  })

  it('should clamp page to minimum 1', () => {
    const searchParams = new URLSearchParams('page=-5')
    const result = parsePageParams(searchParams)
    expect(result.page).toBe(1)
  })

  it('should handle non-numeric values gracefully', () => {
    const searchParams = new URLSearchParams('page=abc&pageSize=xyz')
    const result = parsePageParams(searchParams)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })
})

describe('toSupabaseRange', () => {
  it('should calculate range for first page', () => {
    const result = toSupabaseRange(1, 10)
    expect(result.from).toBe(0)
    expect(result.to).toBe(9)
  })

  it('should calculate range for second page', () => {
    const result = toSupabaseRange(2, 10)
    expect(result.from).toBe(10)
    expect(result.to).toBe(19)
  })

  it('should clamp page to minimum 1', () => {
    const result = toSupabaseRange(0, 10)
    expect(result.from).toBe(0)
  })
})

describe('buildPageMeta', () => {
  it('should build meta for middle page', () => {
    const meta = buildPageMeta(2, 20, 100)
    expect(meta.page).toBe(2)
    expect(meta.pageSize).toBe(20)
    expect(meta.total).toBe(100)
    expect(meta.totalPages).toBe(5)
    expect(meta.hasPrev).toBe(true)
    expect(meta.hasNext).toBe(true)
  })

  it('should build meta for first page', () => {
    const meta = buildPageMeta(1, 10, 30)
    expect(meta.hasPrev).toBe(false)
    expect(meta.hasNext).toBe(true)
  })

  it('should build meta for last page', () => {
    const meta = buildPageMeta(3, 10, 30)
    expect(meta.hasPrev).toBe(true)
    expect(meta.hasNext).toBe(false)
  })

  it('should handle zero total', () => {
    const meta = buildPageMeta(1, 10, 0)
    expect(meta.totalPages).toBe(0)
    expect(meta.hasPrev).toBe(false)
    expect(meta.hasNext).toBe(false)
  })
})
