/**
 * Vitest 全局 Setup
 * 引入 testing-library 的 DOM 匹配器（toBeInTheDocument 等）
 */
import '@testing-library/jest-dom/vitest'

// Mock Next.js 环境变量（测试中通常不需要真实 Supabase）
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'

// 抑制 Supabase 客户端在测试中的初始化警告
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})
