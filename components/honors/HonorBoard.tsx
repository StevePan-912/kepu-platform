'use client'

import { Trophy, Medal, Award, User } from 'lucide-react'
import type { User as UserType } from '@/lib/supabase/types'
import { HONOR_LEVELS } from '@/lib/constants/categories'

interface HonorBoardProps {
  users: UserType[]
  loading: boolean
}

export function HonorBoard({ users, loading }: HonorBoardProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl p-8 text-center text-muted-foreground ring-1 ring-border">
        加载中...
      </div>
    )
  }

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return { Icon: Trophy, color: 'text-warning' }
      case 1: return { Icon: Medal, color: 'text-muted-foreground' }
      case 2: return { Icon: Award, color: 'text-warning' }
      default: return { Icon: Award, color: 'text-muted-foreground' }
    }
  }

  return (
    <div className="bg-card rounded-xl ring-1 ring-border">
      {/* Top 3 showcase */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-t-xl">
        {users.slice(0, 3).map((user, index) => {
          const medal = getMedal(index)
          const honor = user.honor_level ? HONOR_LEVELS[user.honor_level] : null

          return (
            <div key={user.id} className="text-center">
              <div className="flex justify-center mb-2">
                <medal.Icon className={`w-8 h-8 ${medal.color}`} />
              </div>
              <div className="w-12 h-12 bg-muted rounded-full mx-auto flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mt-2 truncate">{user.nickname}</p>
              <p className="text-xs text-muted-foreground">{user.points} 积分</p>
              {honor && (
                <div className="flex justify-center mt-1">
                  <honor.Icon className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Other rankings */}
      <div className="divide-y divide-border">
        {users.slice(3).map((user, index) => {
          const medal = getMedal(index + 3)

          return (
            <div key={user.id} className="px-4 py-3 flex items-center gap-3">
              <medal.Icon className={`w-5 h-5 ${medal.color}`} />
              <span className="text-sm text-muted-foreground w-6">{index + 4}</span>
              <div className="flex-1">
                <p className="text-foreground truncate">{user.nickname}</p>
              </div>
              <span className="text-sm text-muted-foreground">{user.points} 积分</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
