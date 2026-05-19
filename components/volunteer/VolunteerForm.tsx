'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/lib/hooks/useUser'

interface VolunteerFormProps {
  onClose: () => void
  onSubmit: () => void
}

export function VolunteerForm({ onClose, onSubmit }: VolunteerFormProps) {
  const { user } = useUser()
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || !hours) return
    
    setSubmitting(true)
    
    // 模拟提交（实际应写入数据库）
    console.log('志愿者申请:', {
      user_id: user.id,
      hours: parseFloat(hours),
      description,
    })
    
    setSubmitting(false)
    onSubmit()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>申请参与志愿服务</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">服务时长（小时）</label>
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="请输入服务时长"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">服务说明</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请描述您的服务内容"
            />
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-purple-600">
              🎁 完成志愿服务可获得积分奖励
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !hours}
              className="flex-1 bg-purple-500"
            >
              {submitting ? '提交中...' : '提交申请'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
