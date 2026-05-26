# 测试指南

## 测试架构

| 层级 | 工具 | 目录 | 说明 |
|------|------|------|------|
| 单元测试 | Vitest | `tests/` | 工具函数、hooks、查询函数 |
| E2E 测试 | Playwright | `e2e/` | 页面可访问性、API 健康检查、核心流程 |

## 运行测试

```bash
# 单元测试（单次运行）
npm test

# 单元测试（监听模式）
npm run test:watch

# 单元测试（含覆盖率报告）
npm run test:coverage

# E2E 测试（需要先 npm run dev 或自动启动）
npm run test:e2e

# E2E 测试（UI 模式，可视化调试）
npm run test:e2e:ui
```

## 编写单元测试

### 测试文件命名

- `tests/lib/utils/stats.test.ts` — 测试 `lib/utils/stats.ts`
- `tests/lib/hooks/useUser.test.ts` — 测试 `lib/hooks/useUser.ts`
- 遵循 `tests/` 下镜像 `lib/` 目录结构

### 示例

```typescript
import { describe, it, expect } from 'vitest'
import { paginateArray } from '@/lib/utils/pagination'

describe('paginateArray', () => {
  it('should paginate correctly', () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))
    const result = paginateArray(items, { page: 2, pageSize: 10 })

    expect(result.data).toHaveLength(10)
    expect(result.data[0].id).toBe(11)
    expect(result.totalPages).toBe(5)
  })
})
```

### 测试 Supabase 相关代码

测试中对 Supabase 的调用需要 mock：

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}))
```

## 编写 E2E 测试

### 页面测试

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/科普漫步/)
})
```

### API 测试

```typescript
test('GET /api/resources returns valid status', async ({ request }) => {
  const response = await request.get('/api/resources')
  expect(response.status()).toBeLessThan(500)
})
```

## 覆盖率阈值

| 指标 | 阈值 |
|------|------|
| Statements | 60% |
| Branches | 50% |
| Functions | 60% |
| Lines | 60% |

阈值定义在 `vitest.config.ts` 中，CI 中强制检查。

## CI 中的测试

- **push/PR 到 main**：自动运行 lint + 单元测试 + 构建检查
- **PR 到 main**：额外运行 Playwright E2E（chromium）
- 覆盖率和 Playwright 报告作为 artifact 上传，保留 7 天

## 本地环境

```bash
# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install --with-deps

# 初始化 husky（pre-commit hook）
npm run prepare
```
