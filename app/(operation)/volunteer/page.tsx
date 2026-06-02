'use client'

import { useState, useEffect } from 'react'
import { HeartHandshake } from 'lucide-react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { TaskList } from '@/components/volunteer/TaskList'
import { HourRecord } from '@/components/volunteer/HourRecord'
import { VolunteerForm } from '@/components/volunteer/VolunteerForm'
import { useUser } from '@/lib/hooks/useUser'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { VolunteerTask, VolunteerRecord } from '@/lib/supabase/types'

export default function VolunteerPage() {
  const { user, loginDemo } = useUser()
  const [tasks, setTasks] = useState<VolunteerTask[]>([])
  const [myRecords, setMyRecords] = useState<VolunteerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'records'>('tasks')

  const fetchData = async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // 获取志愿者任务
    const { data: tasksData } = await supabase
      .from('volunteer_tasks')
      .select('*')
      .order('created_at', { ascending: false })

    // 获取我的志愿者记录
    if (user) {
      const { data: recordsData } = await supabase
        .from('volunteer_records')
        .select('*')
        .eq('user_id', user.id)

      if (recordsData) setMyRecords(recordsData)
    }

    if (tasksData) setTasks(tasksData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [user])

  // 计算总志愿时长
  const totalHours = myRecords.reduce((sum, r) => sum + (r.service_hours || 0), 0)

  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <NavBar />
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4">
            <HeartHandshake className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground mb-2">登录后参与志愿者活动</p>
          <button
            onClick={() => loginDemo()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
          >
            登录体验
          </button>
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* 页面头部 */}
      <div className="bg-primary text-primary-foreground px-4 py-6">
        <h1 className="text-xl font-bold">科普漫步志愿者</h1>
        <p className="text-sm opacity-80 mt-1">内容共创 · 空间守护 · 服务引导</p>

        {/* 统计 */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalHours}</p>
            <p className="text-xs opacity-80">志愿时长</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{myRecords.length}</p>
            <p className="text-xs opacity-80">完成任务</p>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="px-4 py-3">
        <div className="flex bg-background rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              activeTab === 'tasks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            任务列表
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              activeTab === 'records' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            我的记录
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4 py-2">
        {activeTab === 'tasks' ? (
          <TaskList
            tasks={tasks}
            loading={loading}
            onJoin={() => setShowForm(true)}
          />
        ) : (
          <HourRecord records={myRecords} />
        )}
      </div>

      {/* 申请弹窗 */}
      {showForm && (
        <VolunteerForm
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            setShowForm(false)
            fetchData()
          }}
        />
      )}

      <MobileNav />
    </div>
  )
}
