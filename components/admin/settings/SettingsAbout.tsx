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
  Atom,
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
      {/* Project info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            关于科普漫步
          </CardTitle>
          <CardDescription>智慧科普阵地管理平台</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo & version */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Atom className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">科普漫步</h2>
              <p className="text-sm text-muted-foreground">智慧科普阵地管理平台</p>
              <Badge variant="secondary" className="mt-1.5">
                版本 1.0.0
              </Badge>
            </div>
          </div>

          {/* Project description */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>
              科普漫步是一个智慧科普阵地管理平台，旨在通过数字化手段提升科普设施的管理效率，
              为居民提供丰富的科普互动体验。平台涵盖设施监控、数据分析、智能决策等核心功能模块。
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/StevePan-912/kepu-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors text-foreground"
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

      {/* Tech stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">技术栈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map(tech => (
              <div key={tech.name} className="p-3 rounded-lg border border-border text-center hover:bg-accent transition-colors">
                <div className="font-medium text-sm text-foreground">{tech.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{tech.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
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
              <div key={m.role} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{m.role}</Badge>
                  <span className="text-sm text-muted-foreground">{m.responsibility}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">系统状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">前端框架</span>
              <Badge className="bg-success/10 text-success hover:bg-success/10">运行中</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">数据库（Supabase）</span>
              <Badge className="bg-success/10 text-success hover:bg-success/10">已连接</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">地图服务（Leaflet）</span>
              <Badge className="bg-success/10 text-success hover:bg-success/10">正常</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">部署环境</span>
              <Badge variant="secondary">Vercel Production</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-destructive" /> by 科普漫步团队
        </p>
        <p className="mt-0.5">© 2026 科普漫步. All rights reserved.</p>
      </div>
    </div>
  )
}
