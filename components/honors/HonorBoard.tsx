'use client'

import type { User } from '@/lib/supabase/types'
import { HONOR_LEVELS } from '@/lib/constants/categories'

interface HonorBoardProps {
  users: User[]
  loading: boolean
}

export function HonorBoard({ users, loading }: HonorBoardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        加载中...
      </div>
    )
  }

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return { icon: '🏆', color: 'text-yellow-500' }
      case 1: return { icon: '🥈', color: 'text-gray-400' }
      case 2: return { icon: '🥉', color: 'text-orange-400' }
      default: return { icon: '🏅', color: 'text-gray-500' }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 前三名特殊展示 */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-b from-yellow-50 to-white">
        {users.slice(0, 3).map((user, index) => {
          const medal = getMedal(index)
          const honor = user.honor_level ? HONOR_LEVELS[user.honor_level] : null
          
          return (
            <div key={user.id} className="text-center">
              <div className="text-3xl mb-2">{medal.icon}</div>
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <p className="font-medium text-gray-900 mt-2 truncate">{user.nickname}</p>
              <p className="text-xs text-gray-500">{user.points} 积分</p>
              {honor && (
                <span className="text-sm">{honor.icon}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* 其他排名 */}
      <div className="divide-y divide-gray-100">
        {users.slice(3).map((user, index) => {
          const medal = getMedal(index + 3)
          
          return (
            <div key={user.id} className="px-4 py-3 flex items-center gap-3">
              <span className={`text-lg ${medal.color}`}>{medal.icon}</span>
              <span className="text-sm text-gray-500 w-6">{index + 4}</span>
              <div className="flex-1">
                <p className="text-gray-900 truncate">{user.nickname}</p>
              </div>
              <span className="text-sm text-gray-500">{user.points} 积分</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
