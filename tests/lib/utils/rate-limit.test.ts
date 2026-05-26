/**
 * lib/utils/rate-limit.ts 单元测试
 * 覆盖：checkRateLimit、getRateLimitIdentifier
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/utils/rate-limit'

// Note: rate-limit 使用内存 Map，测试间需要独立运行
describe('checkRateLimit', () => {
  it('should allow first request', () => {
    const result = checkRateLimit({
      identifier: 'test-ip-1',
      maxRequests: 5,
      windowSeconds: 60,
    })
    expect(result.limited).toBe(false)
    expect(result.current).toBe(1)
    expect(result.remaining).toBe(4)
    expect(result.limit).toBe(5)
  })

  it('should track multiple requests for same identifier', () => {
    const opts = { identifier: 'test-track-1', maxRequests: 5, windowSeconds: 60 }
    
    // First 5 requests should pass
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(opts)
      expect(result.limited).toBe(false)
    }
    
    // 6th request should be limited
    const limited = checkRateLimit(opts)
    expect(limited.limited).toBe(true)
    expect(limited.remaining).toBe(0)
  })

  it('should separate limits by identifier', () => {
    checkRateLimit({ identifier: 'ip-a', maxRequests: 2, windowSeconds: 60 })
    checkRateLimit({ identifier: 'ip-a', maxRequests: 2, windowSeconds: 60 })
    checkRateLimit({ identifier: 'ip-a', maxRequests: 2, windowSeconds: 60 })
    
    // ip-b should still be allowed
    const ipB = checkRateLimit({ identifier: 'ip-b', maxRequests: 2, windowSeconds: 60 })
    expect(ipB.limited).toBe(false)
    expect(ipB.current).toBe(1)
  })

  it('should use default maxRequests when not specified', () => {
    const result = checkRateLimit({ identifier: 'test-default' })
    expect(result.limit).toBe(60)
    expect(result.windowSeconds).toBe(60)
  })

  it('should return reset time in seconds', () => {
    const result = checkRateLimit({
      identifier: 'test-reset',
      maxRequests: 10,
      windowSeconds: 30,
    })
    expect(result.resetInSeconds).toBeGreaterThan(0)
    expect(result.resetInSeconds).toBeLessThanOrEqual(30)
  })

  it('should use global identifier when none provided', () => {
    const result = checkRateLimit()
    expect(result.limited).toBe(false)
    expect(result.current).toBe(1)
  })
})

describe('getRateLimitIdentifier', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('https://example.com/api/test', {
      headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
    })
    const id = getRateLimitIdentifier(request, '/api/test')
    expect(id).toBe('192.168.1.1:/api/test')
  })

  it('should use unknown when no forwarded header', () => {
    const request = new Request('https://example.com/api/auth')
    const id = getRateLimitIdentifier(request)
    expect(id).toBe('unknown:')
  })

  it('should include path when provided', () => {
    const request = new Request('https://example.com/api/resources', {
      headers: { 'x-forwarded-for': '10.0.0.1' },
    })
    const id = getRateLimitIdentifier(request, '/api/resources')
    expect(id).toBe('10.0.0.1:/api/resources')
  })
})
