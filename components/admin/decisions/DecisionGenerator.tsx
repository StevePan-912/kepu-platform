'use client'

import { useState } from 'react'
import { Brain, PartyPopper, BookOpen, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createDecisionSuggestion } from '@/lib/supabase/admin/queries'

// 智能模板生成器（接入 AI API 后替换此函数）
function generateSuggestion(type: string, goal: string, priority: number): string {
  const priorityLabel = priority >= 8 ? '高' : priority >= 5 ? '中' : '低'
  const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  const templates: Record<string, string[]> = {
    activity: [
      `针对"${goal}"，建议策划社区科普主题活动周。整合展览路街道现有${randomPick(['6', '8', '10'])}个科普点位的资源，设计打卡集章、知识问答等互动环节。预期周末参与人数提升 20%~35%，建议同步推出线上预约系统降低现场排队压力。`,
      `基于"${goal}"的分析，建议在周末黄金时段（9:00-11:00, 14:00-16:00）增设亲子科普体验活动。利用现有 AR 探境设备和语音导览点播盒，设计「探索小分队」任务式体验。预计可覆盖${randomPick(['50', '80', '120'])}组家庭，优先级${priorityLabel}。`,
      `为达成"${goal}"，建议引入科普志愿者驻点讲解机制。在银杏道、展览馆等高人流点位安排定时讲解，结合语音导览设备辅助。单次活动时长建议控制在 45 分钟内，每日${randomPick(['3', '4', '5'])}场次。`,
    ],
    content: [
      `针对"${goal}"，建议优化科普内容推送策略。根据用户画像分析，展览路街道居民对${randomPick(['天文观测', '植物辨识', '古生物化石', '气象科普'])}类内容兴趣度最高。建议每周更新 2~3 条多媒体科普内容，配合语音导览设备推送。`,
      `基于"${goal}"的需求分析，建议开发系列化科普短视频（每集 3~5 分钟），覆盖展览路特色主题：银杏叶的四季变化、社区气象站数据解读、夜空观测指南等。配合 AR 3D 模型展示，提升内容沉浸感。`,
      `为提升"${goal}"的效果，建议引入用户 UGC 机制：鼓励居民拍摄社区自然观察照片、录制科普讲解语音。优质内容经审核后在资讯屏轮播展示，创作者获得积分奖励。预计月均新增 UGC 内容${randomPick(['30', '50', '80'])}条。`,
    ],
    location: [
      `针对"${goal}"，建议优化科普设备点位布局。当前展览路街道南片区设备密度偏低，建议在百万庄社区服务站、车公庄西地铁站附近增设科普点播盒。预计可覆盖新增居民${randomPick(['2000', '3500', '5000'])}人。`,
      `基于"${goal}"的分析，建议将现有星空角设备从西外文化广场迁移至展览馆南门广场，该位置夜间光污染更低，更适合天文观测类科普活动。同时建议在银杏道增设 AR 探境点，利用银杏叶季节性变化特征。`,
      `为达成"${goal}"，建议沿展览路主要步行路线规划「科普漫步路线」，串联${randomPick(['6', '8', '10'])}个设备点位，总步行距离控制在 2km 以内。沿途设置导览标识和休息座椅，预计单次体验时长 40~60 分钟。`,
    ],
  }

  const pool = templates[type] || templates.activity
  return randomPick(pool)
}

export function DecisionGenerator({ onCreated }: { onCreated?: () => void }) {
  const [type, setType] = useState<string>('activity')
  const [goal, setGoal] = useState('')
  const [priority, setPriority] = useState(5)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleGenerate = async () => {
    if (!goal.trim()) return
    setLoading(true)
    setMessage(null)

    // TODO: 接入真实 AI API 后替换此段
    // const res = await fetch('/api/ai/decision', { method: 'POST', body: JSON.stringify({ type, goal, priority }) })
    // const { suggestion } = await res.json()
    const suggestionText = generateSuggestion(type, goal, priority)

    const { error } = await createDecisionSuggestion({
      type: type as 'activity' | 'content' | 'location',
      suggestion: suggestionText,
      priority,
      is_active: false,
      reason: `基于决策目标"${goal}"生成`,
    })

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: '建议已生成并写入数据库！' })
      setGoal('')
      onCreated?.()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI 智能生成决策建议
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">建议类型</label>
            <Select value={type} onValueChange={(v) => setType(v || 'activity')}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">
                  <span className="flex items-center gap-2">
                    <PartyPopper className="w-4 h-4" /> 活动类
                  </span>
                </SelectItem>
                <SelectItem value="content">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 内容类
                  </span>
                </SelectItem>
                <SelectItem value="location">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 位置类
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">优先级 (1-10)</label>
            <Select value={String(priority)} onValueChange={(v) => setPriority(Number(v))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1} - {i + 1 >= 8 ? '高' : i + 1 >= 5 ? '中' : '低'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">决策目标 / 描述</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="描述你希望分析的决策目标，例如：如何提升周末用户活跃度？"
            className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm min-h-[80px] resize-y bg-background text-foreground"
            rows={3}
          />
        </div>

        {message && (
          <div
            className={`text-sm p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading || !goal.trim()}
          className="bg-primary text-primary-foreground"
        >
          {loading ? '生成中...' : '生成建议'}
        </Button>

        <p className="text-xs text-muted-foreground">
          * 当前为智能模板模式，接入 AI API 后将提供更精准的分析建议。
        </p>
      </CardContent>
    </Card>
  )
}
