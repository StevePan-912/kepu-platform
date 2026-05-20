-- ============================================================
-- schema-v2.sql
-- 在 schema.sql 基础上补充的表和触发器
-- 依赖：已执行 schema.sql
-- 作者：成员1
-- ============================================================

-- ============================================================
-- 设备告警表（admin/queries.ts 已使用，补全表定义）
-- ============================================================
create table if not exists public.device_alerts (
  id            uuid primary key default gen_random_uuid(),
  device_id     uuid references public.devices(id) on delete cascade,
  alert_type    text not null check (alert_type in ('offline', 'low_battery', 'maintenance', 'error')),
  message       text,
  status        text not null default 'pending' check (status in ('pending', 'acknowledged', 'resolved')),
  resolved_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- 为设备告警表启用 RLS
alter table public.device_alerts enable row level security;

-- 只有 admin 可读写告警
create policy "admin_alerts_all" on public.device_alerts
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- 荣誉等级自动更新触发器
-- 积分变化时自动计算 honor_level
-- explorer: 0~499, communicator: 500~1999, leader: 2000+
-- ============================================================
create or replace function public.auto_update_honor_level()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.points >= 2000 then
    new.honor_level := 'leader';
  elsif new.points >= 500 then
    new.honor_level := 'communicator';
  else
    new.honor_level := 'explorer';
  end if;
  return new;
end;
$$;

-- 绑定触发器到 users 表（INSERT 和 UPDATE 时触发）
drop trigger if exists trg_auto_honor_level on public.users;
create trigger trg_auto_honor_level
  before insert or update of points on public.users
  for each row
  execute function public.auto_update_honor_level();

-- ============================================================
-- 搜索热词统计优化索引
-- ============================================================
create index if not exists idx_hot_words_period_count
  on public.hot_words(period, count desc);

create index if not exists idx_hot_words_stat_date
  on public.hot_words(stat_date desc);

-- ============================================================
-- user_activities 索引优化（查询性能）
-- ============================================================
create index if not exists idx_activities_user_id_created
  on public.user_activities(user_id, created_at desc);

create index if not exists idx_activities_action_type
  on public.user_activities(action_type, created_at desc);

create index if not exists idx_activities_resource_id
  on public.user_activities(resource_id, created_at desc)
  where resource_id is not null;

-- ============================================================
-- point_records 索引优化
-- ============================================================
create index if not exists idx_point_records_user_id_created
  on public.point_records(user_id, created_at desc);

-- ============================================================
-- volunteer_records 唯一约束（防止重复报名）
-- ============================================================
alter table public.volunteer_records
  drop constraint if exists uq_volunteer_user_task;
alter table public.volunteer_records
  add constraint uq_volunteer_user_task unique (user_id, task_id);
