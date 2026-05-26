# Supabase Edge Functions 部署指南

> 本文档说明如何部署和管理项目中的 Supabase Edge Functions

## 前置条件

1. 安装 Supabase CLI：
```bash
npm install -g supabase
# 或
brew install supabase/tap/supabase
```

2. 登录 Supabase：
```bash
supabase login
```

3. 链接项目：
```bash
supabase link --project-ref <your-project-ref>
```

## Edge Functions 列表

| Function | 触发方式 | 说明 |
|----------|---------|------|
| `auto-points` | Database Webhook | 用户活动插入时自动奖励积分 |
| `daily-stats` | Cron 定时 | 每日凌晨聚合统计数据 |
| `cleanup` | Cron 定时 | 每周清理过期数据 |

## 部署

### 1. 设置环境变量

```bash
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2. 部署所有 Functions

```bash
# 逐个部署
supabase functions deploy auto-points --no-verify-jwt
supabase functions deploy daily-stats --no-verify-jwt
supabase functions deploy cleanup --no-verify-jwt
```

> `--no-verify-jwt` 允许 Webhook/Cron 调用无需 JWT 验证

### 3. 配置 Database Webhook（auto-points）

在 Supabase Dashboard → Database → Webhooks 中：

- **Name**: `auto-points`
- **Table**: `user_activities`
- **Events**: `INSERT`
- **HTTP Method**: `POST`
- **URL**: `https://<project-ref>.functions.supabase.co/auto-points`
- **Headers**: `Authorization: Bearer <supabase-service-role-key>`

### 4. 配置 Cron Jobs（daily-stats + cleanup）

在 Supabase SQL Editor 中执行：

```sql
-- 每日凌晨1点执行日统计
select cron.schedule(
  'daily-stats',
  '0 1 * * *',
  $$
  select net.http_post(
    url:='https://<project-ref>.functions.supabase.co/daily-stats',
    headers:='{"Authorization": "Bearer <service-role-key>"}'::jsonb
  )
  $$
);

-- 每周日凌晨3点执行数据清理
select cron.schedule(
  'cleanup',
  '0 3 * * 0',
  $$
  select net.http_post(
    url:='https://<project-ref>.functions.supabase.co/cleanup',
    headers:='{"Authorization": "Bearer <service-role-key>"}'::jsonb
  )
  $$
);
```

> 需要先启用 pg_cron 和 pg_net 扩展（Supabase Dashboard → Database → Extensions）

## 本地测试

```bash
# 启动本地 Supabase
supabase start

# 本地运行 Function
supabase functions serve auto-points --no-verify-jwt

# 测试调用
curl -X POST http://localhost:54321/functions/v1/auto-points \
  -H "Content-Type: application/json" \
  -d '{"record": {"user_id": "uuid", "action_type": "view_resource"}}'
```

## 监控与调试

在 Supabase Dashboard → Edge Functions 中查看：
- 调用次数
- 错误率
- 执行时长
- 日志输出

## 积分规则

| 行为类型 | 积分 | 说明 |
|---------|------|------|
| `search` | +1 | 搜索科普内容 |
| `view_resource` | +2 | 浏览科普资源 |
| `scan_ar` | +5 | AR探境体验 |
| `activity_join` | +10 | 参与社区活动 |
| `feedback` | +3 | 提交反馈建议 |
| `play_audio` | +1 | 收听音频讲解 |

每日积分上限：**50 分**
