# 科普漫步 - 智能科普服务平台

**GitHub仓库**: https://github.com/StevePan-912/kepu-platform

## 项目简介

科普漫步是展览路街道"四层一体"智能科普服务体系的数字化平台，涵盖前端服务层、中端数据层、后端管理层、运营生态层四大模块。

## 功能模块

### 居民端（移动端优先）

- **首页**：今日推荐、模块入口、热门话题
- **资源地图**：附近科普点位、设备状态、详情查看（Leaflet）
- **AR探境**：3D模型展示、WebAR体验、语音讲解（model-viewer）
- **语音交互**：热词搜索、语音输入、内容推荐（Web Speech API）
- **积分商城**：商品兑换、积分查询
- **个人中心**：用户信息、积分记录、行为历史

### 数据展示

- **科普资源库**：分类浏览、内容详情、浏览时长统计
- **居民画像**：兴趣标签、活跃度图表、搜索偏好分析
- **资源潜力地图**：三图层可视化

### 管理后台

- **设施监控**：设备状态、告警工单、设备地图
- **数据分析**：热词排行、活跃度曲线、用户增长趋势、资源分类分布
- **智能决策**：活动/内容/布点建议（AI 模板引擎）
- **系统设置**：账户安全、通知配置

### 运营生态

- **志愿者入口**：任务列表、时长记录、志愿报名
- **荣誉展示**：季度/年度榜单、荣誉等级

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js (App Router) | 16.2.4 |
| **语言** | TypeScript | 5 |
| **UI** | React + shadcn/ui (base-nova) | 19.2.4 |
| **样式** | Tailwind CSS | 4 |
| **状态管理** | Zustand | 5 |
| **后端/数据库** | Supabase (PostgreSQL + Auth + Storage) | 2 |
| **地图** | Leaflet + React-Leaflet | 1.9 / 5.0 |
| **AR** | Google model-viewer | 3.4 |
| **图表** | Recharts | 3 |
| **测试** | Vitest + Playwright | 3 / 1.50 |
| **部署** | Vercel (HKG) | - |
| **CI/CD** | GitHub Actions | - |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

> **Demo 模式**：未配置真实 Supabase 时，系统自动使用 mock 数据，支持体验登录。

## 项目结构

```
kepu-platform/
├── app/                        # Next.js App Router 页面
│   ├── page.tsx                # 首页
│   ├── profile/                # 个人中心
│   ├── map/                    # 资源地图
│   ├── ar/                     # AR探境
│   ├── voice/                  # 语音交互
│   ├── mall/                   # 积分商城
│   ├── resources/[id]/         # 资源详情
│   ├── admin/                  # 管理后台
│   │   ├── analytics/          # 数据分析
│   │   ├── decisions/          # 智能决策
│   │   ├── facilities/         # 设施监控
│   │   └── settings/           # 系统设置
│   ├── (operation)/            # 运营端
│   │   ├── volunteer/          # 志愿者入口
│   │   └── honors/             # 荣誉展示
│   └── api/                    # API 路由 (21个端点)
├── components/                 # React 组件
│   ├── ui/                     # shadcn/ui 基础组件
│   ├── layout/                 # 布局组件 (NavBar, MobileNav)
│   ├── map/                    # 地图组件
│   ├── ar/                     # AR 组件
│   ├── voice/                  # 语音组件
│   ├── mall/                   # 商城组件
│   ├── profile/                # 个人中心组件
│   ├── volunteer/              # 志愿者组件
│   ├── honors/                 # 荣誉组件
│   └── admin/                  # 管理后台组件
├── lib/                        # 工具库
│   ├── supabase/               # Supabase 配置 + 查询层
│   │   ├── client.ts           # 客户端工厂 (anon/server/user)
│   │   ├── types.ts            # 数据库类型定义 (13张表)
│   │   ├── queries.ts          # 通用查询
│   │   ├── admin/              # 管理端专用查询
│   │   └── resident/           # 居民端专用查询
│   ├── hooks/                  # React Hooks (useUser, usePoints, useRealtime)
│   ├── utils/                  # 工具函数 (API, 限流, 格式化, 分页)
│   └── constants/              # 常量定义 (分类, 积分规则)
├── supabase/                   # 数据库
│   ├── schema.sql              # 基础表结构 (11张表)
│   ├── schema-v2.sql           # 告警表 + 触发器 + 索引
│   ├── schema-v3.sql           # 每日统计 + RPC
│   ├── rls.sql                 # 行级安全策略
│   ├── seed.sql                # 种子数据
│   └── functions/              # Edge Functions (Deno)
│       ├── auto-points/        # 自动积分 (Webhook)
│       ├── daily-stats/        # 每日统计 (Cron)
│       └── cleanup/            # 数据清理 (Cron)
├── tests/                      # 单元测试
├── e2e/                        # E2E 测试
├── docs/                       # 项目文档
└── public/                     # 静态资源
```

## 数据库设计

共 13 张核心表：

| 表名 | 说明 |
|------|------|
| `users` | 用户信息（积分、荣誉等级、角色） |
| `resources` | 科普资源（音频/视频/AR/文本） |
| `devices` | 科普设备点位（状态、电量、位置） |
| `user_activities` | 用户行为记录（6种行为类型） |
| `hot_words` | 热词统计（按日/周聚合） |
| `point_records` | 积分流水 |
| `products` | 积分商城商品 |
| `exchanges` | 兑换记录 |
| `volunteer_tasks` | 志愿者任务 |
| `volunteer_records` | 志愿服务记录 |
| `decision_suggestions` | AI 决策建议 |
| `device_alerts` | 设备告警 |
| `stats_daily` | 每日统计快照 |

## 开发脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
npm run test         # 运行单元测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告
npm run e2e          # 运行 E2E 测试
```

## 开发团队

| 成员 | 负责模块 |
|------|---------|
| 成员1 | 基础设施、Supabase配置、API接口、CI/CD |
| 成员2 | 前端服务层（首页、地图、AR、语音） |
| 成员3 | 中端数据层（居民画像、资源统计） |
| 成员4 | 后端管理层（设施监控、数据分析、决策） |
| 成员5 | 运营生态层（个人中心、志愿者入口、荣誉展示） |
| 成员6 | UI设计、测试、文档 |

## 许可证

MIT License
