-- ============================================================
-- schema-v3.sql
-- 节点4补充：日统计表 + 积分自增函数 + 存储桶策略
-- 依赖：已执行 schema.sql 和 schema-v2.sql
-- 作者：成员1
-- ============================================================

-- ============================================================
-- 日统计表（供 Edge Function daily-stats 写入）
-- ============================================================
create table if not exists public.stats_daily (
  id              bigint generated always as identity primary key,
  stat_date       date not null unique,
  active_users    integer not null default 0,
  total_activities integer not null default 0,
  new_users       integer not null default 0,
  earned_points   integer not null default 0,
  spent_points    integer not null default 0,
  exchanges       integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 日统计表 RLS：仅 admin 可读
alter table public.stats_daily enable row level security;

create policy "admin_read_stats" on public.stats_daily
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- service_role 可写（Edge Function 使用）
create policy "service_write_stats" on public.stats_daily
  for all using (true)
  with check (true);

-- ============================================================
-- 积分自增 RPC 函数（供 Edge Function auto-points 调用）
-- ============================================================
create or replace function public.increment_points(
  user_id uuid,
  amount integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set points = points + amount
  where id = user_id;
end;
$$;

-- 允许 service_role 执行
revoke all on function public.increment_points(uuid, integer) from public;
grant execute on function public.increment_points(uuid, integer) to service_role;
grant execute on function public.increment_points(uuid, integer) to authenticated;

-- ============================================================
-- 用户行为统计视图（供数据大屏快速查询）
-- ============================================================
create or replace view public.activity_summary as
select
  date_trunc('day', created_at) as day,
  action_type,
  count(*) as count
from public.user_activities
group by day, action_type
order by day desc;

-- ============================================================
-- Storage 存储桶创建指导
-- （需在 Supabase Dashboard → Storage 中手动创建）
-- ============================================================
-- 请执行以下操作：
-- 1. 创建存储桶：resources（科普资源文件）
--    勾选 "Public bucket"
--    文件大小限制：50MB
--    允许 MIME：image/*, audio/*, video/*, application/pdf
--
-- 2. 创建存储桶：avatars（用户头像）
--    勾选 "Public bucket"
--    文件大小限制：5MB
--    允许 MIME：image/*
--
-- 3. 创建存储桶：ar-models（AR 3D 模型）
--    勾选 "Public bucket"
--    文件大小限制：100MB
--    允许 MIME：model/gltf+json, model/gltf-binary, application/octet-stream
--
-- 4. 创建存储桶：exports（数据导出，私有）
--    不勾选 "Public bucket"
--    文件大小限制：10MB
