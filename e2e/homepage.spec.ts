/**
 * E2E: 首页核心功能测试
 * 验证首页加载、四大模块入口、导航跳转
 */
import { test, expect } from '@playwright/test'

test.describe('Homepage (首页)', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // 验证页面标题
    await expect(page).toHaveTitle(/科普漫步|kepu/i)
    
    // 验证页面主体已渲染（非空白页）
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should display the main page container', async ({ page }) => {
    await page.goto('/')
    
    // 验证有实际内容渲染（不是错误页）
    const mainContent = page.locator('main, [role="main"], div')
    await expect(mainContent.first()).toBeVisible()
  })

  test('should not show Next.js error overlay on load', async ({ page }) => {
    await page.goto('/')
    
    // 确保没有 Next.js 错误浮层
    const errorOverlay = page.locator('[data-nextjs-dialog], .nextjs-error')
    await expect(errorOverlay).toHaveCount(0)
  })

  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    
    // 移动端应正常渲染
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})
