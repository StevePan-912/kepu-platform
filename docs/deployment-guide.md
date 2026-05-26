# 部署指南

## Vercel 部署

### 1. 导入项目

在 [Vercel](https://vercel.com) 中导入 GitHub 仓库 `StevePan-912/kepu-platform`

### 2. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# 可选
NEXT_PUBLIC_APP_NAME=科普漫步
NEXT_PUBLIC_APP_URL=https://kepu-platform.vercel.app
```

### 3. 部署

- main 分支推送自动触发部署（vercel.json 已配置）
- 也可以手动触发：`vercel --prod`

### 4. 自定义域名（可选）

Vercel Dashboard → Domains → 添加自定义域名

## Supabase 初始化

### 1. 执行建表脚本

在 Supabase SQL Editor 中按顺序执行：

```
1. supabase/schema.sql      — 基础11张表
2. supabase/schema-v2.sql   — device_alerts + 触发器 + 索引
3. supabase/schema-v3.sql   — stats_daily + RPC函数 + 视图
4. supabase/rls.sql          — 行级安全策略
5. supabase/seed.sql         — 测试种子数据（可选）
```

### 2. 启用扩展

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;
```

### 3. 创建存储桶

在 Supabase Dashboard → Storage 中手动创建：

| 桶名称 | 公开 | 大小限制 | 允许类型 |
|--------|------|---------|---------|
| `resources` | ✅ | 50MB | image/*, audio/*, video/*, application/pdf |
| `avatars` | ✅ | 5MB | image/* |
| `ar-models` | ✅ | 100MB | model/gltf+json, model/gltf-binary |
| `exports` | ❌ | 10MB | application/json, text/csv |

### 4. 配置认证

Supabase Dashboard → Authentication → Providers：
- 启用手 OTP（短信验证码）
- 配置短信模板

## 部署检查清单

- [ ] Vercel 项目创建并连接 GitHub
- [ ] 环境变量全部配置
- [ ] Supabase SQL 脚本全部执行
- [ ] pg_cron / pg_net 扩展已启用
- [ ] 存储桶已创建
- [ ] OTP 认证已配置
- [ ] Edge Functions 已部署
- [ ] Database Webhook 已配置
- [ ] Cron Jobs 已配置
- [ ] 域名 DNS 解析（如需自定义域名）
