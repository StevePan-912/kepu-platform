'use client'

import { useState } from 'react'
import { Bell, MessageSquare, AlertTriangle, Mail, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const notificationSettings = [
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

export function SettingsNotifications() {
  const [settings, setSettings] = useState(notificationSettings)
  const [saving, setSaving] = useState(false)

  const toggleSetting = (id: string, channel: 'email' | 'sms' | 'push') => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, [channel]: !s[channel as keyof typeof s] } : s)
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
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
        <div className="flex gap-4 text-sm text-gray-500">
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
          {settings.map(s => {
            const Icon = s.icon
            return (
              <div key={s.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{s.label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{s.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Email */}
                  <button
                    onClick={() => toggleSetting(s.id, 'email')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.email ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}
                    title="邮件通知"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  {/* SMS */}
                  <button
                    onClick={() => toggleSetting(s.id, 'sms')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.sms ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                    title="短信通知"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  {/* Push */}
                  <button
                    onClick={() => toggleSetting(s.id, 'push')}
                    className={`p-2 rounded-lg transition-colors ${
                      s.push ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-400'
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

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
