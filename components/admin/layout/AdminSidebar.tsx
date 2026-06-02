'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Radio,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  Atom,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const adminNavItems = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '设施监控',
    href: '/admin/facilities',
    icon: Radio,
  },
  {
    title: '数据分析',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: '智能决策',
    href: '/admin/decisions',
    icon: Lightbulb,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Atom className="w-7 h-7 text-primary" />
          <div>
            <span className="font-bold text-foreground">科普漫步</span>
            <span className="block text-xs text-muted-foreground">管理后台</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>系统设置</span>
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-background border-r border-border ${className || ''}`}
      >
        <NavContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger className="lg:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
