-- ============================================================
-- 科普漫步 RLS（行级安全策略）配置
-- 三角色：resident（居民）/ admin（管理员）/ volunteer（志愿者）
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hot_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_suggestions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

CREATE POLICY "users_admin_select_all" ON public.users
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "users_insert_service_role" ON public.users
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "resources_public_read" ON public.resources
  FOR SELECT USING (TRUE);

CREATE POLICY "resources_admin_write" ON public.resources
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "devices_public_read" ON public.devices
  FOR SELECT USING (TRUE);

CREATE POLICY "devices_admin_write" ON public.devices
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "activities_own_select" ON public.user_activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "activities_own_insert" ON public.user_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "activities_admin_read" ON public.user_activities
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "hotwords_public_read" ON public.hot_words
  FOR SELECT USING (TRUE);

CREATE POLICY "hotwords_admin_write" ON public.hot_words
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "points_own_read" ON public.point_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "points_admin_write" ON public.point_records
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "products_user_read" ON public.products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "products_admin_write" ON public.products
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "exchanges_own_read" ON public.exchanges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "exchanges_admin_read" ON public.exchanges
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "exchanges_admin_write" ON public.exchanges
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "vtasks_user_read" ON public.volunteer_tasks
  FOR SELECT USING (TRUE);

CREATE POLICY "vtasks_admin_write" ON public.volunteer_tasks
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "vrecords_own_read" ON public.volunteer_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "vrecords_own_insert" ON public.volunteer_records
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "vrecords_admin_all" ON public.volunteer_records
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "decisions_admin_read" ON public.decision_suggestions
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "decisions_admin_write" ON public.decision_suggestions
  FOR ALL USING (public.get_user_role() = 'admin');
