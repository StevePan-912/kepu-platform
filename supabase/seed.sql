-- ============================================================
-- 科普漫步 测试种子数据（开发/演示环境使用）
-- ============================================================

INSERT INTO public.resources (title, category, type, content_url, duration, description, tags) VALUES
('黑洞的秘密', 'astronomy', 'audio', '/audio/blackhole.mp3', 1200, '探索黑洞的形成与神秘现象', '["黑洞", "天文", "宇宙"]'),
('远古恐龙世界', 'paleontology', 'ar_model', '/models/dinosaur.glb', NULL, '通过AR技术近距离观察恐龙骨架', '["恐龙", "古生物", "AR"]'),
('身边的植物', 'botany', 'video', '/video/plants.mp4', 600, '展览路街道常见植物图鉴', '["植物", "生态", "社区"]'),
('城市生态系统', 'ecology', 'text', NULL, NULL, '了解城市中的生物多样性', '["生态", "城市", "多样性"]');

INSERT INTO public.devices (name, type, status, latitude, longitude, address) VALUES
('展览路1号音频站', 'audio_station', 'online', 39.9320, 116.3640, '展览路1号院门口'),
('科技馆AR体验点', 'ar_point', 'online', 39.9280, 116.3590, '北京科技馆西侧'),
('社区信息屏A', 'screen', 'online', 39.9300, 116.3620, '展览路街道办事处'),
('星空角观测站', 'starlight_corner', 'maintenance', 39.9350, 116.3680, '展览路公园内');

INSERT INTO public.products (name, description, points_required, stock, category) VALUES
('科普笔记本', '精美科普主题笔记本', 100, 50, '文创'),
('宇宙主题帆布包', '印有星系图案的环保帆布袋', 200, 30, '文创'),
('植物观察镜', '便携式10倍放大镜', 150, 20, '工具'),
('科普优先体验券', '优先体验新AR内容', 50, 100, '权益');

INSERT INTO public.hot_words (word, count, period) VALUES
('黑洞', 256, 'weekly'),
('恐龙', 198, 'weekly'),
('火星', 167, 'weekly'),
('星座', 143, 'weekly'),
('植物', 89, 'weekly'),
('生态', 76, 'weekly');

INSERT INTO public.volunteer_tasks (title, description, reward_points, status) VALUES
('科普讲解志愿者', '在展览路科普站为市民提供讲解服务，每次2小时', 50, 'open'),
('设备巡检协助', '协助工作人员对科普设备进行日常巡检', 30, 'open'),
('科普内容收集', '收集社区居民感兴趣的科普话题和建议', 20, 'open');
