'use client'

import { useState } from 'react'
import { Cog, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORAGE_KEY = 'admin_system_configs'

const DEFAULT_CONFIGS = [
  {
    key: 'site_name',
    label: '平台名称',
    value: '科普漫步',
    type: 'text' as const,
    description: '站点显示的 brand 名称',
  },
  {
    key: 'records_per_page',
    label: '每页记录数',
    value: '20',
    type: 'select' as const,
    description: '列表页默认每页显示条数',
    options: [
      { label: '10 条', value: '10' },
      { label: '20 条', value: '20' },
      { label: '50 条', value: '50' },
    ],
  },
  {
    key: 'session_timeout',
    label: '会话超时（分钟）',
    value: '60',
    type: 'number' as const,
    description: '管理员登录会话有效期',
  },
  {
    key: 'enable_registration',
    label: '开放注册',
    value: 'true',
    type: 'boolean' as const,
    description: '是否允许普通用户自主注册',
  },
  {
    key: 'maintenance_mode',
    label: '维护模式',
    value: 'false',
    type: 'boolean' as const,
    description: '开启后仅管理员可访问',
  },
]

function loadStoredConfigs() {
  if (typeof window === 'undefined') return DEFAULT_CONFIGS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const savedValues = JSON.parse(stored) as Record<string, string>
      return DEFAULT_CONFIGS.map((c) =>
        savedValues[c.key] ? { ...c, value: savedValues[c.key] } : c,
      )
    } catch {}
  }
  return DEFAULT_CONFIGS
}

export function SettingsConfig() {
  const [configs, setConfigs] = useState(loadStoredConfigs)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => {
    setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Supabase 连接后替换为 upsert('system_configs', configs)
    const valuesMap = Object.fromEntries(configs.map((c) => [c.key, c.value]))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valuesMap))
    await new Promise((r) => setTimeout(r, 300))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const renderField = (config: (typeof DEFAULT_CONFIGS)[number]) => {
    switch (config.type) {
      case 'text':
        return (
          <Input value={config.value} onChange={(e) => handleChange(config.key, e.target.value)} />
        )
      case 'number':
        return (
          <Input
            type="number"
            value={config.value}
            onChange={(e) => handleChange(config.key, e.target.value)}
          />
        )
      case 'select':
        return (
          <select
            value={config.value}
            onChange={(e) => handleChange(config.key, e.target.value)}
            className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleChange(config.key, 'true')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                config.value === 'true'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              开启
            </button>
            <button
              onClick={() => handleChange(config.key, 'false')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                config.value === 'false'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              关闭
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="w-5 h-5" />
          系统参数配置
        </CardTitle>
        <CardDescription>管理平台运行参数和功能开关</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {configs.map((config) => (
          <div
            key={config.key}
            className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">{config.label}</div>
              {config.description && (
                <div className="text-sm text-muted-foreground mt-0.5">{config.description}</div>
              )}
            </div>
            <div className="w-48 flex-shrink-0">{renderField(config)}</div>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存配置'}
          </Button>
          {saved && (
            <span className="text-sm text-success flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              配置已保存
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
