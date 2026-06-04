'use client'

import { useState, useEffect, useTransition } from 'react'
import { HeartHandshake } from 'lucide-react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { TaskList } from '@/components/volunteer/TaskList'
import { HourRecord } from '@/components/volunteer/HourRecord'
import { VolunteerForm } from '@/components/volunteer/VolunteerForm'
import { useUser } from '@/lib/hooks/useUser'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { VolunteerTask, VolunteerRecord } from '@/lib/supabase/types'

// Mock 志愿者任务数据
const MOCK_TASKS: VolunteerTask[] = [
  {
    id: 'vt-1',
    title: '科普设备巡检员',
    description: '定期巡检社区内科普点播盒、智慧屏等设备的运行状态',
    reward_points: 50,
    status: 'open',
    max_volunteers: 10,
    start_time: new Date(Date.now() - 7 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 23 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vt-2',
    title: '银杏道科普讲解员',
    description: '在银杏大道为居民讲解银杏叶的生物学特征和历史文化',
    reward_points: 80,
    status: 'full',
    max_volunteers: 5,
    start_time: new Date(Date.now() - 14 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 16 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vt-3',
    title: '社区科普活动摄影',
    description: '负责社区科普活动的照片和视频拍摄，用于宣传展示',
    reward_points: 100,
    status: 'open',
    max_volunteers: 3,
    start_time: new Date(Date.now() - 3 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 27 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vt-4',
    title: '青少年科学实验辅导',
    description: '协助指导社区青少年完成趣味科学实验，培养科学兴趣',
    reward_points: 60,
    status: 'open',
    max_volunteers: 8,
    start_time: new Date(Date.now() - 1 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 29 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_RECORDS: VolunteerRecord[] = [
  {
    id: 'vr-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    task_id: 'vt-1',
    status: 'completed',
    service_hours: 2,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
  {
    id: 'vr-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    task_id: 'vt-3',
    status: 'approved',
    service_hours: 4,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function VolunteerPage() {
  const { user, loginDemo } = useUser()
  const [tasks, setTasks] = useState<VolunteerTask[]>([])
  const [myRecords, setMyRecords] = useState<VolunteerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'tasks' | 'records'>('tasks')

  const fetchData = async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setTasks(MOCK_TASKS)
      if (user) setMyRecords(MOCK_RECORDS)
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

    setTasks(tasksData && tasksData.length > 0 ? tasksData : MOCK_TASKS)
    setLoading(false)
  }

  useEffect(() => {
    startTransition(() => {
      fetchData()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              activeTab === 'records'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            我的记录
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4 py-2">
        {activeTab === 'tasks' ? (
          <TaskList tasks={tasks} loading={loading} onJoin={() => setShowForm(true)} />
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
