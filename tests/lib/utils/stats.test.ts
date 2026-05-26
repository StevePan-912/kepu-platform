/**
 * lib/utils/stats.ts 单元测试
 * 覆盖：groupByDate、groupByField、calcGrowthRate、topN、daysAgoISO
 */
import { describe, it, expect } from 'vitest'
import {
  groupByDate,
  groupByField,
  calcGrowthRate,
  calcPeriodGrowth,
  topN,
  daysAgoISO,
} from '@/lib/utils/stats'

describe('groupByDate', () => {
  const records = [
    { created_at: '2026-05-01T10:00:00Z', count: 5 },
    { created_at: '2026-05-01T12:00:00Z', count: 3 },
    { created_at: '2026-05-02T08:00:00Z', count: 7 },
    { created_at: '2026-05-02T14:00:00Z', count: 2 },
    { created_at: '2026-05-03T09:00:00Z', count: 1 },
  ]

  it('should group records by date and sum count', () => {
    const result = groupByDate(records, 'created_at', 'count')
    expect(result).toHaveLength(3)
    expect(result[0].date).toBe('2026-05-01')
    expect(result[0].value).toBe(8)
    expect(result[1].date).toBe('2026-05-02')
    expect(result[1].value).toBe(9)
  })

  it('should return empty array for empty input', () => {
    const result = groupByDate([], 'created_at', 'count')
    expect(result).toEqual([])
  })

  it('should handle single record', () => {
    const result = groupByDate([{ created_at: '2026-05-01T10:00:00Z', val: 10 }], 'created_at', 'val')
    expect(result).toHaveLength(1)
    expect(result[0].value).toBe(10)
  })

  it('should sort by date ascending', () => {
    const unordered = [
      { created_at: '2026-05-03T09:00:00Z', count: 1 },
      { created_at: '2026-05-01T10:00:00Z', count: 5 },
    ]
    const result = groupByDate(unordered, 'created_at', 'count')
    expect(result[0].date).toBe('2026-05-01')
    expect(result[1].date).toBe('2026-05-03')
  })
})

describe('groupByField', () => {
  const records = [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 },
    { category: 'A', value: 5 },
    { category: 'C', value: 15 },
  ]

  it('should group by field and sum values', () => {
    const result = groupByField(records, 'category', 'value')
    expect(result).toEqual([
      { key: 'A', value: 15 },
      { key: 'B', value: 20 },
      { key: 'C', value: 15 },
    ])
  })

  it('should handle empty array', () => {
    expect(groupByField([], 'field', 'value')).toEqual([])
  })
})

describe('calcGrowthRate', () => {
  it('should calculate positive growth rate', () => {
    expect(calcGrowthRate(100, 120)).toBe(20)
  })

  it('should calculate negative growth rate', () => {
    expect(calcGrowthRate(100, 80)).toBe(-20)
  })

  it('should return 0 when previous is 0', () => {
    expect(calcGrowthRate(0, 50)).toBe(0)
  })

  it('should handle same values', () => {
    expect(calcGrowthRate(50, 50)).toBe(0)
  })

  it('should round to 2 decimal places', () => {
    expect(calcGrowthRate(3, 4)).toBe(33.33)
  })
})

describe('calcPeriodGrowth', () => {
  const data = [
    { date: '2026-05-01', value: 100 },
    { date: '2026-05-02', value: 110 },
    { date: '2026-05-03', value: 105 },
    { date: '2026-05-04', value: 130 },
    { date: '2026-05-05', value: 120 },
  ]

  it('should calculate growth over last N days', () => {
    const result = calcPeriodGrowth(data, 'date', 'value', 4)
    // Growth from day1 (100) to day5 (120) = 20%
    expect(result).toBe(20)
  })

  it('should return 0 for insufficient data', () => {
    const result = calcPeriodGrowth(data.slice(0, 1), 'date', 'value', 4)
    expect(result).toBe(0)
  })
})

describe('topN', () => {
  const records = [
    { name: 'A', score: 10 },
    { name: 'B', score: 50 },
    { name: 'C', score: 30 },
    { name: 'D', score: 20 },
    { name: 'E', score: 40 },
  ]

  it('should return top N sorted by field descending', () => {
    const result = topN(records, 'score', 3)
    expect(result).toHaveLength(3)
    expect(result[0].name).toBe('B')
    expect(result[1].name).toBe('E')
    expect(result[2].name).toBe('C')
  })

  it('should return all when N > length', () => {
    const result = topN(records, 'score', 10)
    expect(result).toHaveLength(5)
  })

  it('should return empty for empty input', () => {
    expect(topN([], 'score', 3)).toEqual([])
  })
})

describe('daysAgoISO', () => {
  it('should return ISO string for N days ago', () => {
    const result = daysAgoISO(7)
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - 7)
    // Compare date part only (ignore time variation)
    expect(result.startsWith(expectedDate.toISOString().split('T')[0])).toBe(true)
  })

  it('should return today for 0 days', () => {
    const result = daysAgoISO(0)
    const today = new Date().toISOString().split('T')[0]
    expect(result.startsWith(today)).toBe(true)
  })
})
