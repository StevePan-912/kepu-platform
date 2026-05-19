# 科普漫步 - 智能科普服务平台

**GitHub仓库**: https://github.com/StevePan-912/kepu-platform

## 项目简介

科普漫步是展览路街道"四层一体"智能科普服务体系的数字化平台，涵盖前端服务层、中端数据层、后端管理层、运营生态层四大模块。

## 功能模块

### 居民端（移动端）

- **首页**：今日推荐、模块入口、热门话题
- **资源地图**：附近科普点位、设备状态、详情查看
- **AR探境**：3D模型展示、WebAR体验、语音讲解
- **语音交互**：热词搜索、语音输入、内容推荐
- **积分商城**：商品兑换、积分查询
- **个人中心**：用户信息、积分记录、行为历史

### 数据展示

- **科普资源库**：分类浏览、内容详情
- **居民画像**：兴趣标签、活跃度图表
- **资源潜力地图**：三图层可视化

### 管理后台

- **设施监控**：设备状态、工单管理
- **数据分析**：热词排行、活跃度曲线
- **智能决策**：活动/内容/布点建议

### 运营生态

- **志愿者入口**：任务列表、时长记录
- **荣誉展示**：季度/年度榜单

## 技术栈

- **前端**：Next.js 16 + Tailwind CSS + shadcn/ui
- **后端**：Supabase (PostgreSQL + Auth + Storage)
- **部署**：Vercel
- **地图**：Leaflet + React-Leaflet
- **AR**：model-viewer
- **图表**：Recharts

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入 Supabase 配置：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
kepu-platform/
├── app/                    # Next.js 页面
│   ├── (resident)/         # 居民端页面
│   │   └── profile/        # 个人中心
│   ├── (operation)/        # 运营端页面
│   │   ├── volunteer/      # 志愿者入口
│   │   └── honors/         # 荣誉展示
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── globals.css         # 全局样式
├── components/             # React 组件
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── layout/             # 布局组件
│   ├── common/             # 通用组件
│   ├── profile/            # 个人中心组件
│   ├── volunteer/          # 志愿者组件
│   └── honors/             # 荣誉组件
├── lib/                    # 工具库
│   ├── supabase/           # Supabase 配置
│   ├── hooks/              # React Hooks
│   ├── utils/              # 工具函数
│   └── constants/          # 常量定义
└── public/                 # 静态资源
```

## 开发团队

| 成员 | 负责模块 |
|------|---------|
| 成员1 | 基础设施、Supabase配置、API接口 |
| 成员2 | 前端服务层 |
| 成员3 | 中端数据层 |
| 成员4 | 后端管理层 |
| 成员5 | 运营生态层（个人中心、志愿者入口、荣誉展示） |
| 成员6 | UI设计、测试、文档 |

## 许可证

MIT License
