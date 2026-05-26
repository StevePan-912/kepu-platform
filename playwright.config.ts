import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 测试配置
 * 运行：npm run test:e2e
 */
export default defineConfig({
  // 测试文件目录
  testDir: './e2e',
  
  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',
  
  // 每个测试的超时时间
  timeout: 30_000,
  
  // 全局 expect 超时
  expect: {
    timeout: 10_000,
  },
  
  // 失败重试（CI中重试2次）
  retries: process.env.CI ? 2 : 0,
  
  // 并行执行的 worker 数
  workers: process.env.CI ? 2 : undefined,
  
  // 报告格式
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],
  
  // 全局配置
  use: {
    // 基础 URL（可通过环境变量覆盖）
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    
    // 截图设置
    screenshot: 'only-on-failure',
    
    // 录像设置
    video: 'retain-on-failure',
    
    // Trace 设置
    trace: 'retain-on-failure',
  },
  
  // 浏览器配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  // 开发服务器（E2E 启动前自动运行）
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
