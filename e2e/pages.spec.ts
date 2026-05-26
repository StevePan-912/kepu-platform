/**
 * E2E: 核心页面可访问性测试
 * 验证各主要路由页面正常加载不报错
 */
import { test, expect } from '@playwright/test'

// 核心路由列表（所有队友已完成的页面）
const CORE_ROUTES = [
  { path: '/', name: '首页' },
  { path: '/map', name: '资源地图' },
  { path: '/ar', name: 'AR探境' },
  { path: '/voice', name: '语音交互' },
  { path: '/mall', name: '积分商城' },
  { path: '/profile', name: '个人中心' },
  { path: '/resources/1', name: '资源详情' },
]

// 管理后台路由（需登录，测试只验证不崩溃）
const ADMIN_ROUTES = [
  { path: '/admin', name: '管理仪表盘' },
  { path: '/admin/analytics', name: '数据分析' },
  { path: '/admin/decisions', name: '决策中心' },
  { path: '/admin/settings', name: '系统设置' },
]

test.describe('Core Pages (核心页面可访问性)', () => {
  for (const route of CORE_ROUTES) {
    test(`should load ${route.name} page (${route.path}) without crash`, async ({ page }) => {
      const response = await page.goto(route.path)
      
      // 不应返回500错误
      if (response) {
        expect(response.status()).toBeLessThan(500)
      }
      
      // 页面应有内容（非空白）
      const body = page.locator('body')
      await expect(body).toBeVisible()
      
      // 不应显示 Next.js 构建错误
      const buildError = page.locator('text=Application error')
      await expect(buildError).toHaveCount(0)
    })
  }
})

test.describe('Admin Pages (管理后台)', () => {
  for (const route of ADMIN_ROUTES) {
    test(`should load ${route.name} page (${route.path}) without 500`, async ({ page }) => {
      const response = await page.goto(route.path)
      
      // 管理后台可能重定向或显示登录提示，但不应500
      if (response) {
        expect(response.status()).toBeLessThan(500)
      }
    })
  }
})
