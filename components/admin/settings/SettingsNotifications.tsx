'use client'

import { useState } from 'react'
import { Bell, MessageSquare, AlertTriangle, Mail, Smartphone, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'admin_notification_settings'

interface NotificationItem {
  id: string
  label: string
  description: string
  icon: typeof Bell
  email: boolean
  sms: boolean
  push: boolean
}

const DEFAULT_SETTINGS: NotificationItem[] = [
  {
    id: 'device_alert',
    label: '设备告警通知',
    description: '当设备离线、低电量或故障时通知',
    icon: AlertTriangle,
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'user_feedback',
    label: '用户反馈通知',
    description: '有新用户反馈时通知',
    icon: MessageSquare,
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'system_update',
    label: '系统更新通知',
    description: '系统维护或版本更新时通知',
    icon: Bell,
    email: true,
    sms: false,
    push: false,
  },
]

function loadStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const savedFlags = JSON.parse(stored) as Record<
        string,
        { email: boolean; sms: boolean; push: boolean }
      >
      return DEFAULT_SETTINGS.map((s) => (savedFlags[s.id] ? { ...s, ...savedFlags[s.id] } : s))
    } catch {}
  }
  return DEFAULT_SETTINGS
}

export function SettingsNotifications() {
  const [settings, setSettings] = useState(loadStoredNotifications)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleSetting = (id: string, channel: 'email' | 'sms' | 'push') => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel as keyof typeof s] } : s)),
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Supabase 连接后替换为 upsert('notification_settings', settings)
    const flagsMap = Object.fromEntries(
      settings.map((s) => [s.id, { email: s.email, sms: s.sms, push: s.push }]),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flagsMap))
    await new Promise((r) => setTimeout(r, 300))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          通知设置
        </CardTitle>
        <CardDescription>配置各类通知的接收方式和渠道</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 渠道说明 */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>邮件</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>短信</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            <span>站内推送</span>
          </div>
        </div>

        {/* 通知项列表 */}
        <div className="space-y-4">
          {settings.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.id}
                className="flex items-start justify-between p-4 rounded-lg ring-1 ring-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{s.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSetting(s.id, 'email')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.email ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                    title="邮件通知"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSetting(s.id, 'sms')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.sms ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}
                    title="短信通知"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSetting(s.id, 'push')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.push ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                    title="站内推送"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存设置'}
          </Button>
          {saved && (
            <span className="text-sm text-success flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              设置已保存
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
