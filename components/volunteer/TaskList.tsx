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
      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    open: { label: '招募中', color: 'bg-success/10 text-success' },
    in_progress: { label: '进行中', color: 'bg-accent text-primary' },
    completed: { label: '已完成', color: 'bg-muted text-muted-foreground' },
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const status = statusLabels[task.status]

        return (
          <div key={task.id} className="bg-background rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-foreground">{task.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium">
                  +{task.reward_points} 积分
                </span>
              </div>

              {task.status === 'open' && (
                <Button size="sm" onClick={onJoin} className="bg-primary text-primary-foreground">
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
