'use client'

import { useState } from 'react'
import { Lock, Shield, Key, Smartphone, Trash2, Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function SettingsSecurity() {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [changing, setChanging] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordChange = (key: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [key]: value }))
    setPwdMsg(null)
  }

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setPwdMsg({ type: 'error', text: '两次输入的新密码不一致' })
      return
    }
    if (passwordForm.new.length < 6) {
      setPwdMsg({ type: 'error', text: '新密码长度至少6位' })
      return
    }
    setChanging(true)
    setPwdMsg(null)
    await new Promise(r => setTimeout(r, 1000))
    setChanging(false)
    setPwdMsg({ type: 'success', text: '密码修改成功' })
    setPasswordForm({ current: '', new: '', confirm: '' })
  }

  const twoFAEnabled = true

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          安全设置
        </CardTitle>
        <CardDescription>管理账户安全和登录验证方式</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Change password */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            修改密码
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">当前密码</label>
              <Input
                type="password"
                value={passwordForm.current}
                onChange={e => handlePasswordChange('current', e.target.value)}
                placeholder="请输入当前密码"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">新密码</label>
              <Input
                type="password"
                value={passwordForm.new}
                onChange={e => handlePasswordChange('new', e.target.value)}
                placeholder="至少6位字符"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">确认新密码</label>
              <Input
                type="password"
                value={passwordForm.confirm}
                onChange={e => handlePasswordChange('confirm', e.target.value)}
                placeholder="再次输入新密码"
              />
            </div>
          </div>
          {pwdMsg && (
            <div className={`text-sm flex items-center gap-1 ${pwdMsg.type === 'success' ? 'text-success' : 'text-destructive'}`}>
              {pwdMsg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              {pwdMsg.text}
            </div>
          )}
          <Button onClick={handleChangePassword} disabled={changing}>
            {changing ? '修改中...' : '修改密码'}
          </Button>
        </div>

        <hr className="border-border" />

        {/* 2FA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Smartphone className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="font-medium text-foreground">双因素认证 (2FA)</div>
              <div className="text-sm text-muted-foreground">使用 authenticator 应用增强账户安全</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {twoFAEnabled ? (
              <Badge className="bg-success/10 text-success hover:bg-success/10">已启用</Badge>
            ) : (
              <Badge variant="secondary">未启用</Badge>
            )}
            <Button variant="outline" size="sm">
              {twoFAEnabled ? '管理' : '启用'}
            </Button>
          </div>
        </div>

        <hr className="border-border" />

        {/* Sessions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">登录会话</div>
              <div className="text-sm text-muted-foreground">当前有 2 个活跃会话</div>
            </div>
          </div>
          <Button variant="outline" size="sm">管理会话</Button>
        </div>

        <hr className="border-border" />

        {/* Danger zone */}
        <div>
          <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4" />
            危险操作
          </h3>
          <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <div className="font-medium text-foreground">删除账户</div>
              <div className="text-sm text-muted-foreground">永久删除账户及所有关联数据，此操作不可恢复</div>
            </div>
            <Button variant="destructive" size="sm">删除账户</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
