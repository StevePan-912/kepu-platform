# 贡献指南

## 团队协作规则

### 分支策略

- `main` — 生产分支，所有代码最终合并到此
- 功能分支命名：`feat/<module>/<description>`，如 `feat/api/user-portrait`

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <description>

feat(api): 新增用户画像接口
fix(client): 修复 Supabase 客户端初始化
docs(readme): 更新部署文档
```

类型：`feat` `fix` `docs` `style` `refactor` `test` `chore`

### 模块归属

| 成员 | 模块 | 文件路径 |
|------|------|----------|
| 成员1 | 基础设施/API | `lib/`, `app/api/`, `middleware.ts`, `supabase/` |
| 成员2 | 居民端前端 | `app/(resident)/`, `app/ar/`, `app/voice/`, `app/mall/`, `app/resources/`, `app/profile/`, `app/map/` |
| 成员3 | 中端数据层 | `app/data/` (待定) |
| 成员4 | 管理后台 | `app/admin/`, `components/admin/`, `lib/supabase/admin/` |
| 成员5 | 运营生态层 | `app/(operation)/` |
| 成员6 | UI/测试/文档 | `components/ui/`, `tests/`, `e2e/`, `docs/` |

### 开发流程

1. **同步最新代码**：`git pull origin main`
2. **创建功能分支**：`git checkout -b feat/your-module/feature-name`
3. **开发 + 测试**：
   ```bash
   npm run dev        # 启动开发服务器
   npm test           # 运行单元测试
   npm run test:e2e   # 运行 E2E 测试
   ```
4. **提交前检查**：
   - `npm run lint` 无错误
   - `npm run build` 成功
   - `npm test` 全部通过
5. **提交**：`git commit -m "feat(scope): description"`
6. **推送**：`git push origin feat/your-module/feature-name`
7. **创建 PR**：在 GitHub 上创建 Pull Request 到 `main`

### Pre-commit Hook

提交前自动运行：
- ESLint 检查和修复（`.ts`, `.tsx`）
- Prettier 格式化（`.ts`, `.tsx`, `.json`, `.md`, `.css`）

首次克隆后运行 `npm run prepare` 初始化 hooks。

### 环境变量

复制 `.env.local.example` 为 `.env.local` 并填入实际值：

| 变量 | 说明 | 获取位置 |
|------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名公钥 | Supabase Dashboard → Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端密钥 | Supabase Dashboard → Settings |

### 代码规范

- TypeScript 严格模式，禁止 `any`
- 使用路径别名 `@/` 导入（对应项目根目录）
- API 响应使用 `lib/utils/api.ts` 中的 `apiSuccess`/`apiError` 封装
- 分页使用 `lib/utils/pagination.ts` 工具
- 速率限制使用 `lib/utils/rate-limit.ts`

### 关键节点同步

每完成一个交付节点：
1. 确保 `npm run build` + `npm test` 通过
2. 推送到 GitHub
3. 在团队群中通知 `@所有人` 同步拉取

### CI/CD

- 每次 push/PR 到 main 自动触发 CI（lint + 测试 + 构建）
- Vercel 自动部署 main 分支
- CI 失败会阻止合并

### 问题反馈

遇到构建/测试/部署问题，在 GitHub Issues 中提交，标注 `bug` 或 `help-wanted` 标签。
