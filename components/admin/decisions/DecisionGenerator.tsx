'use client'

import { useState } from 'react'
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

    // Mock AI 生成：基于目标生成建议文本
    const typeLabel =
      type === 'activity' ? '科普活动' : type === 'content' ? '科普内容' : '科普设施位置'
    const suggestionText = `【AI 建议】针对"${goal}"，建议优化${typeLabel}策略：增加相关投入，预计可提升用户参与度 15%~30%。建议优先级设为 ${priority}。`

    const { data, error } = await createDecisionSuggestion({
      type: type as any,
      suggestion_text: suggestionText,
      priority,
      is_active: false,
      reason: `基于决策目标"${goal}"由 AI 生成`,
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
        <CardTitle className="text-base">🧠 AI 智能生成决策建议</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">建议类型</label>
            <Select value={type} onValueChange={(v) => setType(v || 'activity')}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">🎪 活动类</SelectItem>
                <SelectItem value="content">📚 内容类</SelectItem>
                <SelectItem value="location">📍 位置类</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">优先级 (1-10)</label>
            <Select value={String(priority)} onValueChange={v => setPriority(Number(v))}>
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
          <label className="text-sm font-medium">决策目标 / 描述</label>
          <textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="描述你希望分析的决策目标，例如：如何提升周末用户活跃度？"
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm min-h-[80px] resize-y"
            rows={3}
          />
        </div>

        {message && (
          <div className={`text-sm p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <Button onClick={handleGenerate} disabled={loading || !goal.trim()}>
          {loading ? '生成中...' : '🧠 生成建议'}
        </Button>

        <p className="text-xs text-gray-400">
          * 当前为 Mock 模式，AI 功能接入后此处将调用真实 AI API 生成建议。
        </p>
      </CardContent>
    </Card>
  )
}
