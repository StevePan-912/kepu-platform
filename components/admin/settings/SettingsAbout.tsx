'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Info,
  ExternalLink,
  Heart,
  BookOpen,
  Users,
} from 'lucide-react'

const techStack = [
  { name: 'Next.js 16', description: 'React 全栈框架' },
  { name: 'Supabase', description: '后端即服务 (PostgreSQL+Auth+Storage)' },
  { name: 'Tailwind CSS 4', description: '原子化样式框架' },
  { name: 'shadcn/ui', description: '组件库' },
  { name: 'Zustand', description: '轻量状态管理' },
  { name: 'Recharts', description: '图表可视化' },
  { name: 'Leaflet', description: '地图引擎' },
  { name: 'Vercel', description: '部署平台' },
]

const teamMembers = [
  { role: '成员1', responsibility: '基础设施、Supabase配置' },
  { role: '成员2', responsibility: '前端服务层（居民端）' },
  { role: '成员3', responsibility: '中端数据层（数据展示）' },
  { role: '成员4', responsibility: '后端管理层（管理后台）' },
  { role: '成员5', responsibility: '运营生态层（志愿者+商城）' },
  { role: '成员6', responsibility: 'UI设计、测试、文档' },
]

export function SettingsAbout() {
  return (
    <div className="space-y-6">
      {/* 项目信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            关于科普漫步
          </CardTitle>
          <CardDescription>智慧科普阵地管理平台</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo & 版本 */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl">
              🌟
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">科普漫步</h2>
              <p className="text-sm text-gray-500">智慧科普阵地管理平台</p>
              <Badge className="mt-1.5 bg-blue-100 text-blue-700 hover:bg-blue-100">
                版本 1.0.0
              </Badge>
            </div>
          </div>

          {/* 项目描述 */}
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>
              科普漫步是一个智慧科普阵地管理平台，旨在通过数字化手段提升科普设施的管理效率，
              为居民提供丰富的科普互动体验。平台涵盖设施监控、数据分析、智能决策等核心功能模块。
            </p>
          </div>

          {/* 链接 */}
          <div className="flex gap-3">
            <a
              href="https://github.com/StevePan-912/kepu-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              源代码
            </a>
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-1.5" />
              使用文档
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 技术栈 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">技术栈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map(tech => (
              <div key={tech.name} className="p-3 border rounded-lg text-center hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm text-gray-900">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tech.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 开发团队 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4" />
            开发团队（6人）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map(m => (
              <div key={m.role} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{m.role}</Badge>
                  <span className="text-sm text-gray-600">{m.responsibility}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 系统状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">系统状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">前端框架</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">运行中</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">数据库（Supabase）</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">已连接</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">地图服务（Leaflet）</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">正常</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">部署环境</span>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Vercel Production</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 版权 */}
      <div className="text-center text-xs text-gray-400 pt-2">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-400" /> by 科普漫步团队
        </p>
        <p className="mt-0.5">© 2024 科普漫步. All rights reserved.</p>
      </div>
    </div>
  )
}
