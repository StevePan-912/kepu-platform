'use client'

import { useState } from 'react'
import { User, Mail, Phone, Building, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORAGE_KEY = 'admin_profile'

const DEFAULT_FORM = {
  name: '管理员',
  email: 'admin@kepu.com',
  phone: '13800138000',
  department: '技术部',
}

function loadStoredProfile() {
  if (typeof window === 'undefined') return DEFAULT_FORM
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {}
  }
  return DEFAULT_FORM
}

export function SettingsProfile() {
  const [form, setForm] = useState(loadStoredProfile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Supabase 连接后替换为 upsert('admin_profiles', form)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    await new Promise((r) => setTimeout(r, 300))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          个人信息
        </CardTitle>
        <CardDescription>管理您的个人账户信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary text-2xl font-semibold">
            {form.name.charAt(0)}
          </div>
          <Button variant="outline" size="sm">
            更换头像
          </Button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">姓名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-9"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">部门</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={form.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存修改'}
          </Button>
          {saved && (
            <span className="text-sm text-success flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              保存成功
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
