'use client'

import { PointsBadge } from '@/components/common/PointsBadge'
import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'
import type { User } from '@/lib/supabase/types'
import { HONOR_LEVELS } from '@/lib/constants/categories'

interface ProfileCardProps {
  user: User
  onLogout: () => void
}

export function ProfileCard({ user, onLogout }: ProfileCardProps) {
  const nextLevel = user.honor_level === 'explorer' ? 'communicator' :
                    user.honor_level === 'communicator' ? 'leader' : null
  
  const pointsToNext = nextLevel ? HONOR_LEVELS[nextLevel].minPoints - user.points : 0

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          {/* 用户头像 */}
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          
          {/* 用户信息 */}
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.nickname}</h2>
            <p className="text-sm opacity-80 mt-1">{user.phone}</p>
          </div>
          
          {/* 设置按钮 */}
          <button className="p-2 bg-white/20 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        {/* 荣誉等级 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user.honor_level && <PointsBadge level={user.honor_level as 'explorer' | 'communicator' | 'leader'} />}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{user.points}</p>
            <p className="text-xs opacity-80">积分</p>
          </div>
        </div>
        
        {/* 升级进度 */}
        {nextLevel && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>距离 {HONOR_LEVELS[nextLevel].label}</span>
              <span>{pointsToNext} 积分</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full">
              <div 
                className="h-full bg-white rounded-full"
                style={{ width: `${(user.points / HONOR_LEVELS[nextLevel].minPoints) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* 快捷入口 */}
      <div className="px-4 pb-4 flex gap-3">
        <Button variant="outline" className="flex-1 bg-white/20 text-white border-white/30">
          编辑资料
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 bg-white/20 text-white border-white/30"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          退出
        </Button>
      </div>
    </div>
  )
}
