import { SettingsProfile, SettingsConfig, SettingsNotifications, SettingsSecurity, SettingsAbout } from '@/components/admin/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, User, Bell, Shield, Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">⚙️ 系统设置</h1>
        <p className="text-gray-500 text-sm mt-1">
          个人信息 · 通知偏好 · 安全设置 · 系统参数
        </p>
      </div>

      {/* Tabs 切换 */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="profile" className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            个人信息
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            系统参数
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            通知设置
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            关于
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SettingsProfile />
        </TabsContent>

        <TabsContent value="config">
          <SettingsConfig />
        </TabsContent>

        <TabsContent value="notifications">
          <SettingsNotifications />
        </TabsContent>

        <TabsContent value="security">
          <SettingsSecurity />
        </TabsContent>

        <TabsContent value="about">
          <SettingsAbout />
        </TabsContent>
      </Tabs>
    </div>
  )
}
