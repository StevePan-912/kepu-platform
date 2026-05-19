'use client'

import { Button } from '@/components/ui/button'
import type { VolunteerTask } from '@/lib/supabase/types'

interface TaskListProps {
  tasks: VolunteerTask[]
  loading: boolean
  onJoin: () => void
}

export function TaskList({ tasks, loading, onJoin }: TaskListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        加载中...
      </div>
    )
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    open: { label: '招募中', color: 'bg-green-100 text-green-600' },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-600' },
    completed: { label: '已完成', color: 'bg-gray-100 text-gray-600' },
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const status = statusLabels[task.status]
        
        return (
          <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                {status.label}
              </span>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-medium">
                  +{task.points_reward} 积分
                </span>
              </div>
              
              {task.status === 'open' && (
                <Button size="sm" onClick={onJoin} className="bg-purple-500">
                  申请参与
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
