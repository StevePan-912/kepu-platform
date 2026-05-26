import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // 测试环境：jsdom 模拟浏览器（用于 hooks/组件测试）
    environment: 'jsdom',
    
    // 全局测试 API（无需手动 import describe/it/expect）
    globals: true,
    
    // Setup 文件（引入 testing-library 匹配器）
    setupFiles: ['./tests/setup.ts'],
    
    // 测试文件匹配模式
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['lib/**/*.{ts,tsx}'],
      exclude: [
        'lib/**/*.d.ts',
        'lib/**/index.ts',
        'lib/supabase/types.ts',
      ],
      // 覆盖率阈值（CI 中强制）
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
    
    // 路径别名（与 tsconfig 保持一致）
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  },
})
